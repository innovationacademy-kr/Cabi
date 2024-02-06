package org.ftclub.cabinet.cqrs.manager;

import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.FULL;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.PENDING;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.cqrs.service.CqrsService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.log.Logging;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Logging
@Transactional(readOnly = true)
public class CqrsManager {

	private final LentQueryService lentQueryService;
	private final CabinetQueryService cabinetQueryService;

	private final CqrsService cqrsService;


	@Async
	public void synchronizeDatabase() {
		this.clearAll();

		// 전체에서 1번씩만 초기화 해주면 되는 부분
		this.syncBuildingsAndFloors();

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

	@Async
	public void changeCabinet(Cabinet cabinet) {
		this.changeAvailableCabinet(cabinet);
	}

	public void clearAll() {
		cqrsService.clearBuildingFloors();
		cqrsService.clearFloors();
		cqrsService.clearAvailableCabinet();
		cqrsService.clearCabinetPerSection();
	}

	private void syncAll(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		this.syncAvailableCabinet(cabinet);
		this.syncCabinetPerSection(cabinet, cabinetLentHistories);
	}

	private void syncBuildingsAndFloors() {
		cabinetQueryService.findAllBuildings().forEach(building -> {
			List<Integer> floors = cabinetQueryService.findAllFloorsByBuilding(building);
			cqrsService.addBuildingFloors(building, floors);
			cqrsService.addFloors(building, floors);
		});

	}

	/**
	 * 사물함의 상태가 AVAILABLE, PENDING일 때, availableCabinet에 추가
	 *
	 * @param cabinet 사물함
	 */
	private void syncAvailableCabinet(Cabinet cabinet) {
		if (cabinet.isLentType(LentType.CLUB)) {
			return;
		}
		if (cabinet.isStatus(AVAILABLE)) {
			cqrsService.addAvailableCabinet(cabinet);
		} else if (cabinet.isStatus(PENDING)) {
			cqrsService.addAvailableCabinet(cabinet);
		}
	}

	private void changeAvailableCabinet(Cabinet cabinet) {
		if (cabinet.isLentType(LentType.CLUB)) {
			return;
		}
		if (cabinet.isStatus(AVAILABLE)) {
			cqrsService.addAvailableCabinet(cabinet);
		} else if (cabinet.isStatus(PENDING)) {
			cqrsService.addAvailableCabinet(cabinet);
		} else if (cabinet.isStatus(FULL)) {
			cqrsService.removeAvailableCabinet(cabinet);
		}
	}

	private void syncCabinetPerSection(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		// TODO: 구현 필요
		// User도 Join으로 영속화 해둔 상태이기 때문에, LentHistory.getUser()를 사용하여 User 정보를 가져올 수 있음
	}
}
