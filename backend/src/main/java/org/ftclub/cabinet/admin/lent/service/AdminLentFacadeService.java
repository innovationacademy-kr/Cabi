package org.ftclub.cabinet.admin.lent.service;

import static org.ftclub.cabinet.cabinet.domain.LentType.SHARE;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetCommandService;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.ClubLentCommandService;
import org.ftclub.cabinet.lent.service.ClubLentQueryService;
import org.ftclub.cabinet.lent.service.LentCommandService;
import org.ftclub.cabinet.lent.service.LentPolicyService;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.service.BanHistoryCommandService;
import org.ftclub.cabinet.user.service.BanPolicyService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminLentFacadeService {

	private final CabinetQueryService cabinetQueryService;
	private final CabinetCommandService cabinetCommandService;
	private final UserQueryService userQueryService;
	private final BanHistoryCommandService banHistoryCommandService;
	private final LentQueryService lentQueryService;
	private final LentCommandService lentCommandService;
	private final LentRedisService lentRedisService;

	private final ClubLentQueryService clubLentQueryService;
	private final ClubLentCommandService clubLentCommandService;

	private final LentPolicyService lentPolicyService;
	private final BanPolicyService banPolicyService;

	private final LentMapper lentMapper;

	@Transactional(readOnly = true)
	public LentHistoryPaginationDto getUserLentHistories(Long userId, Pageable pageable) {
		userQueryService.getUser(userId);
		Page<LentHistory> lentHistories =
				lentQueryService.findUserLentHistories(userId, pageable);
		List<LentHistoryDto> result = lentHistories.stream()
				.sorted(Comparator.comparing(LentHistory::getStartedAt))
				.map(lh -> lentMapper.toLentHistoryDto(lh, lh.getUser(), lh.getCabinet()))
				.collect(Collectors.toList());
		return lentMapper.toLentHistoryPaginationDto(result, lentHistories.getTotalElements());
	}

	@Transactional
	public void endUserLent(List<Long> userIds) {
		LocalDateTime now = LocalDateTime.now();
		List<LentHistory> lentHistories =
				lentQueryService.findUserActiveLentHistoriesInCabinetForUpdate(userIds.get(0));
		System.out.println("lentHistories = " + lentHistories);
		if (lentHistories.isEmpty()) {
			Long cabinetId = lentRedisService.findCabinetJoinedUser(userIds.get(0));
			if (cabinetId != null) {
				userIds.forEach(userId ->
						lentRedisService.deleteUserInCabinet(cabinetId, userId));
			}
			return;
		}

		Cabinet cabinet = cabinetQueryService.getCabinet(lentHistories.get(0).getCabinetId());
		// 반납 유저 최대 4명으로 worst 16개 검색 -> set으로 변환하는 것보다 빠르고 메모리 절약
		List<LentHistory> userLentHistories = lentHistories.stream()
				.filter(lh -> userIds.contains(lh.getUserId()))
				.collect(Collectors.toList());
		if (userLentHistories.isEmpty()) {
			throw ExceptionStatus.NOT_FOUND_LENT_HISTORY.asServiceException();
		}
		int userRemainCount = lentHistories.size() - userIds.size();
		cabinetCommandService.changeUserCount(cabinet, userRemainCount);
		lentCommandService.endLent(userLentHistories, now);
		lentHistories.forEach(lh ->
				lentRedisService.setPreviousUserName(cabinet.getId(), lh.getUser().getName()));

		LocalDateTime expiredAt = userLentHistories.get(0).getExpiredAt();
		BanType banType = banPolicyService.verifyBan(now, expiredAt);
		LocalDateTime unbannedAt = banPolicyService.getUnBannedAt(now, expiredAt);
		banHistoryCommandService.banUsers(userIds, now, unbannedAt, banType);
		if (cabinet.isLentType(SHARE)) {
			LocalDateTime newExpiredAt = lentPolicyService.adjustShareCabinetExpirationDate(
					userRemainCount, now, expiredAt);
			List<Long> lentHistoryIds = lentHistories.stream()
					.map(LentHistory::getId).collect(Collectors.toList());
			lentCommandService.setExpiredAt(lentHistoryIds, newExpiredAt);
		}
	}

	@Transactional
	public void endCabinetLent(List<Long> cabinetIds) {
		List<Cabinet> cabinets = cabinetQueryService.findCabinetsForUpdate(cabinetIds);
		List<LentHistory> lentHistories =
				lentQueryService.findCabinetsActiveLentHistories(cabinetIds);
		Map<Long, List<LentHistory>> lentHistoriesByCabinetId = lentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getCabinetId));

		// is club cabinet
		if (lentHistories.isEmpty()) {
			endClubCabinetLent(cabinetIds, cabinets);
			return;
		}

		LocalDateTime now = LocalDateTime.now();
		cabinets.forEach(cabinet -> {
			List<LentHistory> cabinetLentHistories =
					lentHistoriesByCabinetId.get(cabinet.getId());
			cabinetLentHistories.forEach(lh -> lentCommandService.endLent(lh, now));
			cabinetCommandService.changeUserCount(cabinet, 0);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.AVAILABLE);
			lentRedisService.setPreviousUserName(
					cabinet.getId(), cabinetLentHistories.get(0).getUser().getName());
		});
		lentCommandService.endLent(lentHistories, now);
		cabinetCommandService.changeUserCount(cabinets, 0);
	}

	private void endClubCabinetLent(List<Long> cabinetIds, List<Cabinet> cabinets) {
		List<ClubLentHistory> allActiveLentHistoriesWithClub = clubLentQueryService.getAllActiveClubLentHistoriesWithCabinets(
				cabinetIds);
		cabinets.forEach(cabinet -> {
			List<ClubLentHistory> clubLentHistories =
					allActiveLentHistoriesWithClub.stream()
							.filter(clh -> clh.getCabinetId().equals(cabinet.getId()))
							.collect(Collectors.toList());
			clubLentHistories.forEach(
					clh -> clubLentCommandService.endLent(clh, LocalDateTime.now()));
			cabinetCommandService.changeUserCount(cabinet, 0);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.AVAILABLE);
			lentRedisService.setPreviousUserName(
					cabinet.getId(), clubLentHistories.get(0).getClub().getName());
		});
	}
}
