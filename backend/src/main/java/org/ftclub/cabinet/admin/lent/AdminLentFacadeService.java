package org.ftclub.cabinet.admin.lent;

import static org.ftclub.cabinet.cabinet.domain.LentType.SHARE;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.newService.CabinetCommandService;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentCommandService;
import org.ftclub.cabinet.lent.service.LentPolicyService;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.newService.BanHistoryCommandService;
import org.ftclub.cabinet.user.newService.BanPolicyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Log4j2
public class AdminLentFacadeService {

	private final CabinetQueryService cabinetQueryService;
	private final CabinetCommandService cabinetCommandService;
	private final BanHistoryCommandService banHistoryCommandService;
	private final LentQueryService lentQueryService;
	private final LentCommandService lentCommandService;
	private final LentRedisService lentRedisService;

	private final LentPolicyService lentPolicyService;
	private final BanPolicyService banPolicyService;

	@Transactional
	public void endUserLent(Long userId) {
		log.debug("Called endUserLent: {}", userId);

		LocalDateTime now = LocalDateTime.now();
		LentHistory userLentHistory = lentQueryService.getUserActiveLentHistoryWithLock(userId);
		List<LentHistory> cabinetLentHistories =
				lentQueryService.findCabinetActiveLentHistories(userLentHistory.getCabinetId());
		Cabinet cabinet =
				cabinetQueryService.getCabinetsWithLock(userLentHistory.getCabinetId());

		int userRemainCount = cabinetLentHistories.size() - 1;
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
			cabinetLentHistories.stream().filter(lh -> !lh.equals(userLentHistory))
					.forEach(lh -> lentCommandService.setExpiredAt(lh, expiredAt));
		}
	}

	@Transactional
	public void endCabinetLent(List<Long> cabinetIds) {
		log.debug("Called endCabinetsLent: {}", cabinetIds);

		LocalDateTime now = LocalDateTime.now();
		List<Cabinet> cabinets = cabinetQueryService.getCabinetsWithLock(cabinetIds);
		List<LentHistory> lentHistories =
				lentQueryService.findCabinetsActiveLentHistories(cabinetIds);
		Map<Long, List<LentHistory>> lentHistoriesByCabinetId = lentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getCabinetId));
		cabinets.forEach(cabinet -> {
			List<LentHistory> cabinetLentHistories =
					lentHistoriesByCabinetId.get(cabinet.getCabinetId());
			lentRedisService.setPreviousUserName(
					cabinet.getCabinetId(), cabinetLentHistories.get(0).getUser().getName());
		});
		lentCommandService.endLent(lentHistories, now);
		cabinetCommandService.changeUserCount(cabinets, 0);
	}
}
