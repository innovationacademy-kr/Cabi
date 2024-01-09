package org.ftclub.cabinet.admin.lent.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetCommandService;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
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

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.ftclub.cabinet.cabinet.domain.LentType.SHARE;


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
	public void endUserLent(Long userId) {
		LocalDateTime now = LocalDateTime.now();
		List<LentHistory> lentHistories =
				lentQueryService.findUserActiveLentHistoriesInCabinetWithLock(userId);
		if (lentHistories.isEmpty()) {
			Long cabinetId = lentRedisService.findCabinetJoinedUser(userId);
			if (cabinetId != null) {
				lentRedisService.deleteUserInCabinetSession(cabinetId, userId);
			}
			return;
		}
		LentHistory userLentHistory = lentHistories.stream()
				.filter(lh -> lh.getUserId().equals(userId)).findFirst()
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_LENT_HISTORY));
		Cabinet cabinet = cabinetQueryService.findCabinets(userLentHistory.getCabinetId());

		int userRemainCount = lentHistories.size() - 1;
		cabinetCommandService.changeUserCount(cabinet, userRemainCount);
		lentCommandService.endLent(userLentHistory, now);
		lentRedisService.setPreviousUserName(cabinet.getId(), userLentHistory.getUser().getName());

		LocalDateTime endedAt = userLentHistory.getEndedAt();
		BanType banType = banPolicyService.verifyBan(endedAt, userLentHistory.getExpiredAt());
		if (!banType.equals(BanType.NONE)) {
			LocalDateTime unbannedAt = banPolicyService.getUnBannedAt(
					endedAt, userLentHistory.getExpiredAt());
			banHistoryCommandService.banUser(userId, endedAt, unbannedAt, banType);
		}
		if (cabinet.isLentType(SHARE)) {
			LocalDateTime expiredAt = lentPolicyService.adjustShareCabinetExpirationDate(
					userRemainCount, now, userLentHistory);
			List<Long> lentHistoryIds = lentHistories.stream()
					.filter(lh -> !lh.equals(userLentHistory))
					.map(LentHistory::getId).collect(Collectors.toList());
			lentCommandService.setExpiredAt(lentHistoryIds, expiredAt);
		}
	}

	@Transactional
	public void endCabinetLent(List<Long> cabinetIds) {
		LocalDateTime now = LocalDateTime.now();
		List<Cabinet> cabinets = cabinetQueryService.findCabinetsWithLock(cabinetIds);
		List<LentHistory> lentHistories =
				lentQueryService.findCabinetsActiveLentHistories(cabinetIds);
		Map<Long, List<LentHistory>> lentHistoriesByCabinetId = lentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getCabinetId));
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
}
