package org.ftclub.cabinet.cqrs.manager;

import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.FULL;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.PENDING;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.cqrs.service.CqrsService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.ClubLentQueryService;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
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
	private final ClubLentQueryService clubLentQueryService;
	private final UserQueryService userQueryService;
	private final LentRedisService lentRedisService;

	private final CqrsService cqrsService;


	@Async
	@Transactional(readOnly = true)
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
	@Transactional(readOnly = true)
	public void changeCabinet(Cabinet cabinet) {
		// 영속화(연관관계를 가지는 엔티티 포함)
		Cabinet findCabinet = cabinetQueryService.getCabinet(cabinet.getId());

		this.changeAvailableCabinet(findCabinet);
		this.changeCabinetPerSection(findCabinet);
		this.changeCabinetInfo(findCabinet);
	}

	@Async
	@Transactional(readOnly = true)
	public void changeCabinetLentHistory(LentHistory lentHistory) {
		// LentHistory PostPersist 경우 DB에서 찾으면 없기 때문에 비영속 상태 유지 + 연관관계를 가지는 엔티티 영속화
		Cabinet cabinet = cabinetQueryService.getCabinet(lentHistory.getCabinetId());
		User user = userQueryService.getUser(lentHistory.getUserId());

		this.changeCabinetPerSection(lentHistory, cabinet, user);
		this.changeCabinetInfo(lentHistory, cabinet, user);
	}

	public void clearAll() {
		cqrsService.clearBuildingFloors();
		cqrsService.clearFloors();
		cqrsService.clearAvailableCabinet();
		cqrsService.clearCabinetPerSection();
		cqrsService.clearCabinetInfo();
	}

	private void syncAll(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		this.syncAvailableCabinet(cabinet);
		this.syncCabinetPerSection(cabinet, cabinetLentHistories);
		this.syncCabinetInfo(cabinet, cabinetLentHistories);
	}

	/************************************* BuildingsAndFloors *************************************/

	private void syncBuildingsAndFloors() {
		cabinetQueryService.findAllBuildings().forEach(building -> {
			List<Integer> floors = cabinetQueryService.findAllFloorsByBuilding(building);
			cqrsService.addBuildingFloors(building, floors);
			cqrsService.addFloors(building, floors);
		});
	}

	/**************************************** CabinetInfo *****************************************/

	private void syncCabinetInfo(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		cqrsService.addCabinetInfo(cabinet);
		Long cabinetId = cabinet.getId();

		if (cabinet.isLentType(LentType.CLUB)) {
			ClubLentHistory activeClubLentHistory =
					clubLentQueryService.findActiveLentHistoryWithClub(cabinetId);
			if (activeClubLentHistory != null) {
				cqrsService.addClubLentHistoryOnCabinetInfo(activeClubLentHistory);
			}
		} else {
			List<LentHistory> activeCabinetLentHistories = cabinetLentHistories.stream()
					.filter(l -> l.getEndedAt() == null)
					.collect(Collectors.toList());
			if (activeCabinetLentHistories.isEmpty()) {
				List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinetId);
				List<User> users = userQueryService.findUsers(usersInCabinet);
				LocalDateTime sessionExpired = lentRedisService.getSessionExpired(cabinetId);
				cqrsService.addSessionCabinetInfo(cabinetId, users, sessionExpired);
			} else {
				activeCabinetLentHistories.forEach(cqrsService::addLentHistoryOnCabinetInfo);
			}
		}
	}

	private void changeCabinetInfo(Cabinet cabinet) {
		cqrsService.addCabinetInfo(cabinet);
	}

	private void changeCabinetInfo(LentHistory lentHistory, Cabinet cabinet, User user) {
		if (lentHistory.getEndedAt() == null) {
			cqrsService.addLentHistoryOnCabinetInfo(lentHistory);
		} else {
			cqrsService.removeLentHistoryOnCabinetInfo(lentHistory);
		}
	}

	/************************************** AvailableCabinet **************************************/

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

	/************************************* CabinetPerSection **************************************/

	private void syncCabinetPerSection(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		cqrsService.addCabinetPerSection(cabinet);
		List<LentHistory> activeCabinetLentHistories = cabinetLentHistories.stream()
				.filter(l -> l.getEndedAt() == null).collect(Collectors.toList());
		activeCabinetLentHistories.forEach(lentHistory ->
				cqrsService.addLentHistoryOnCabinetPerSection(cabinet, lentHistory.getUser()));
	}

	private void changeCabinetPerSection(Cabinet cabinet) {
		cqrsService.addCabinetPerSection(cabinet);
	}

	private void changeCabinetPerSection(LentHistory lentHistory, Cabinet cabinet, User user) {
		if (lentHistory.getEndedAt() == null) {
			cqrsService.addLentHistoryOnCabinetPerSection(cabinet, user);
		} else {
			cqrsService.removeLentHistoryOnCabinetPerSection(cabinet, user);
		}
	}
}
