package org.ftclub.cabinet.cqrs.manager;

import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.PENDING;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.cqrs.service.CqrsService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Logging
public class CqrsManager {

	private final LentQueryService lentQueryService;
	private final CabinetQueryService cabinetQueryService;

	private final CqrsService cqrsService;


	@Transactional(readOnly = true)
	public void synchronizeDatabase() {
		this.clearAll();

		// User - LentHistory - Cabinet 데이터 동기화
		List<Long> allCabinetIds = cabinetQueryService.findAllCabinetIds();
		for (Long cabinetId : allCabinetIds) {
			List<LentHistory> cabinetLentHistories =
					lentQueryService.findCabinetLentHistoriesWithUserAndCabinet(cabinetId);
			Cabinet cabinet;
			if (cabinetLentHistories.isEmpty()) {
				cabinet = cabinetQueryService.getCabinet(cabinetId);
			} else {
				cabinet = cabinetLentHistories.get(0).getCabinet();
			}

			this.syncAll(cabinet, cabinetLentHistories);
		}
	}

	@Transactional(readOnly = true)
	public void synchronizeCabinet(Cabinet cabinet) {
		List<LentHistory> cabinetLentHistories =
				lentQueryService.findCabinetLentHistoriesWithUserAndCabinet(cabinet.getId());
		this.syncAll(cabinet, cabinetLentHistories);
	}

	private void clearAll() {
		cqrsService.clearPendingCabinet();
		cqrsService.clearCabinetPerSection();
	}

	private void syncAll(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		this.syncPendingCabinet(cabinet, cabinetLentHistories);
		this.syncCabinetPerSection(cabinet, cabinetLentHistories);
	}

	/**
	 * 사물함의 상태가 AVAILABLE, PENDING일 때, pendingCabinet에 추가
	 *
	 * @param cabinet              사물함
	 * @param cabinetLentHistories 사물함의 대여 이력
	 */
	private void syncPendingCabinet(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		if (cabinet.isStatus(AVAILABLE)) {
			cqrsService.addPendingCabinet(cabinet);
		} else if (cabinet.isStatus(PENDING)) {
			LocalDate yesterday = LocalDateTime.now().minusDays(1).toLocalDate();

			LentHistory recentLentHistory = cabinetLentHistories.stream()
					.max(Comparator.comparing(LentHistory::getEndedAt)).orElse(null);
			if (recentLentHistory != null && recentLentHistory.isSameEndedAtDate(yesterday)) {
				cqrsService.addPendingCabinet(cabinet);
			}
		}
	}

	private void syncCabinetPerSection(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		// TODO: 구현 필요
		// User도 Join으로 영속화 해둔 상태이기 때문에, LentHistory.getUser()를 사용하여 User 정보를 가져올 수 있음
	}
}
