package org.ftclub.cabinet.admin.lent;

import static org.ftclub.cabinet.cabinet.domain.LentType.SHARE;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.newService.CabinetCommandService;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentCommandService;
import org.ftclub.cabinet.lent.service.LentPolicyService;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.newService.BanHistoryCommandService;
import org.ftclub.cabinet.user.newService.BanPolicyService;
import org.ftclub.cabinet.user.newService.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Log4j2
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
		log.debug("Called getAllUserLentHistories: {}", userId);

		userQueryService.getUser(userId);
		Page<LentHistory> lentHistories =
				lentQueryService.findUserActiveLentHistories(userId, pageable);
		List<LentHistoryDto> result = lentHistories.stream()
				.sorted(Comparator.comparing(LentHistory::getStartedAt))
				.map(lh -> lentMapper.toLentHistoryDto(lh, lh.getUser(), lh.getCabinet()))
				.collect(Collectors.toList());
		return lentMapper.toLentHistoryPaginationDto(result, lentHistories.getTotalElements());
	}

	@Transactional
	public void endUserLent(Long userId) {
		log.debug("Called endUserLent: {}", userId);

		LocalDateTime now = LocalDateTime.now();
		List<LentHistory> lentHistories =
				lentQueryService.findUserActiveLentHistoriesInCabinet(userId);
		if (lentHistories.isEmpty()) {
			Long cabinetId = lentRedisService.findCabinetJoinedUser(userId);
			if (cabinetId != null) {
				lentRedisService.deleteUserInCabinetSession(cabinetId, userId);
			}
			return;
		}
		Cabinet cabinet = cabinetQueryService.findCabinets(lentHistories.get(0).getCabinetId());
		LentHistory userLentHistory = lentHistories.stream()
				.filter(lh -> lh.getUserId().equals(userId)).findFirst()
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_LENT_HISTORY));

		int userRemainCount = lentHistories.size() - 1;
		cabinetCommandService.changeUserCount(cabinet, userRemainCount);
		lentCommandService.endLent(userLentHistory, now);
		lentRedisService.setPreviousUserName(
				cabinet.getCabinetId(), userLentHistory.getUser().getName());

		LocalDateTime endedAt = userLentHistory.getEndedAt();
		BanType banType = banPolicyService.verifyBan(endedAt, userLentHistory.getExpiredAt());
		if (!banType.equals(BanType.NONE)) {
			LocalDateTime unbannedAt = banPolicyService.getUnBannedAt(
					endedAt, userLentHistory.getExpiredAt());
			banHistoryCommandService.banUser(userId, endedAt, unbannedAt, banType);
		}
		if (cabinet.isLentType(SHARE)) {
			LocalDateTime expiredAt = lentPolicyService.adjustSharCabinetExpirationDate(
					userRemainCount, now, userLentHistory);
			lentHistories.stream().filter(lh -> !lh.equals(userLentHistory))
					.forEach(lh -> lentCommandService.setExpiredAt(lh, expiredAt));
		}
	}

	@Transactional
	public void endCabinetLent(List<Long> cabinetIds) {
		log.debug("Called endCabinetsLent: {}", cabinetIds);

		LocalDateTime now = LocalDateTime.now();
		List<Cabinet> cabinets = cabinetQueryService.findCabinetsWithLock(cabinetIds);
		List<LentHistory> lentHistories =
				lentQueryService.findCabinetsActiveLentHistories(cabinetIds);
		Map<Long, List<LentHistory>> lentHistoriesByCabinetId = lentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getCabinetId));
		cabinets.forEach(cabinet -> {
			List<LentHistory> cabinetLentHistories =
					lentHistoriesByCabinetId.get(cabinet.getCabinetId());
			cabinetLentHistories.forEach(lh -> lentCommandService.endLent(lh, now));
			cabinetCommandService.changeUserCount(cabinet, 0);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.AVAILABLE);
			lentRedisService.setPreviousUserName(
					cabinet.getCabinetId(), cabinetLentHistories.get(0).getUser().getName());
		});
		lentCommandService.endLent(lentHistories, now);
		cabinetCommandService.changeUserCount(cabinets, 0);
	}
}
