package org.ftclub.cabinet.cqrs.manager;

import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.BROKEN;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.FULL;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.IN_SESSION;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.OVERDUE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.PENDING;
import static org.ftclub.cabinet.cabinet.domain.LentType.PRIVATE;
import static org.ftclub.cabinet.cabinet.domain.LentType.SHARE;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.cqrs.service.CqrsCabinetService;
import org.ftclub.cabinet.cqrs.service.CqrsUserService;
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

	private final CqrsCabinetService cqrsCabinetService;
	private final CqrsUserService cqrsUserService;


	@Async
	@Transactional(readOnly = true)
	public void synchronizeDatabase() {
		this.clearAll();

		// 전체에서 1번씩만 초기화 해주면 되는 부분
		this.syncBuildingsAndFloors();

		// 데이터 동기화
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
		this.changeUserLentInfo(cabinet);
	}

	@Async
	@Transactional(readOnly = true)
	public void changeCabinetLentHistory(LentHistory lentHistory) {
		// LentHistory PostPersist 경우 DB에서 찾으면 없기 때문에 비영속 상태 유지 + 연관관계를 가지는 엔티티 영속화
		Cabinet cabinet = cabinetQueryService.getCabinet(lentHistory.getCabinetId());
		User user = userQueryService.getUser(lentHistory.getUserId());

		this.changeCabinetPerSection(lentHistory, cabinet, user);
		this.changeCabinetInfo(lentHistory);

		this.changeUserLentInfo(cabinet, lentHistory);
		this.changeUserLentHistories(cabinet, lentHistory, user);
	}

	// userId만 남기도록 덮어쓰기
	@Async
	@Transactional(readOnly = true)
	public void setSessionLent(Long cabinetId, List<Long> userIds) {
		List<User> users = userQueryService.findUsers(userIds);
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);

		this.setSessionCabinetInfo(cabinet, users, sessionExpiredAt);
		this.setSessionCabinetPerSection(cabinet, users);
		this.setUserLentInfo(cabinet, userIds);
	}

	// userIds에 포함된다면 모든 정보를 삭제
	@Async
	@Transactional(readOnly = true)
	public void removeSessionLent(Long cabinetId, List<Long> userIds) {
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);

		System.out.println("cabinet = " + cabinet);
		System.out.println("userIds = " + userIds);
		this.removeSessionCabinetInfo(cabinetId, userIds);
		this.removeSessionCabinetPerSection(cabinet, userIds);
		this.removeUserLentInfo(userIds);
	}

	public void clearAll() {
		cqrsCabinetService.clearBuildingFloors();
		cqrsCabinetService.clearFloors();
		cqrsCabinetService.clearAvailableCabinet();
		cqrsCabinetService.clearCabinetPerSection();
		cqrsCabinetService.clearCabinetInfo();

		cqrsUserService.clearUserLentInfo();
		cqrsUserService.clearUserLentHistories();
	}

	private void syncAll(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		this.syncAvailableCabinet(cabinet);
		this.syncCabinetPerSection(cabinet, cabinetLentHistories);
		this.syncCabinetInfo(cabinet, cabinetLentHistories);

		this.syncUserLentInfo(cabinet, cabinetLentHistories);
		this.syncUserLentHistories(cabinet, cabinetLentHistories);
	}

	/************************************* BuildingsAndFloors *************************************/

	private void syncBuildingsAndFloors() {
		cabinetQueryService.findAllBuildings().forEach(building -> {
			List<Integer> floors = cabinetQueryService.findAllFloorsByBuilding(building);
			cqrsCabinetService.addBuildingFloors(building, floors);
			cqrsCabinetService.addFloors(building, floors);
		});
	}

	/**************************************** CabinetInfo *****************************************/

	private void syncCabinetInfo(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		Long cabinetId = cabinet.getId();
		LocalDateTime sessionExpired = lentRedisService.getSessionExpired(cabinetId);
		cqrsCabinetService.addCabinetInfo(cabinet, sessionExpired);

		if (cabinet.isLentType(LentType.CLUB)) {
			ClubLentHistory activeClubLentHistory =
					clubLentQueryService.findActiveLentHistoryWithClub(cabinetId);
			if (activeClubLentHistory != null) {
				cqrsCabinetService.addClubLentHistoryOnCabinetInfo(activeClubLentHistory);
			}
		} else {
			List<LentHistory> activeCabinetLentHistories = cabinetLentHistories.stream()
					.filter(l -> l.getEndedAt() == null)
					.collect(Collectors.toList());
			if (activeCabinetLentHistories.isEmpty()) {
				List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinetId);
				List<User> users = userQueryService.findUsers(usersInCabinet);
				cqrsCabinetService.setSessionCabinetInfo(cabinetId, users, sessionExpired);
			} else {
				activeCabinetLentHistories.forEach(cqrsCabinetService::addLentHistoryOnCabinetInfo);
			}
		}
	}

	private void changeCabinetInfo(Cabinet cabinet) {
		LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinet.getId());
		cqrsCabinetService.addCabinetInfo(cabinet, sessionExpiredAt);
	}

	private void changeCabinetInfo(LentHistory lentHistory) {
		if (lentHistory.getEndedAt() == null) {
			cqrsCabinetService.addLentHistoryOnCabinetInfo(lentHistory);
		} else {
			cqrsCabinetService.removeLentHistoryOnCabinetInfo(lentHistory);
		}
	}

	private void setSessionCabinetInfo(Cabinet cabinet, List<User> users,
			LocalDateTime sessionExpiredAt) {
		cqrsCabinetService.setSessionCabinetInfo(cabinet.getId(), users, sessionExpiredAt);
	}

	private void removeSessionCabinetInfo(Long cabinetId, List<Long> users) {
		System.out.println("11111111111111");
		cqrsCabinetService.removeSessionCabinetInfo(cabinetId, users);
	}

	/************************************** AvailableCabinet **************************************/

	private void syncAvailableCabinet(Cabinet cabinet) {
		if (cabinet.isLentType(LentType.CLUB)) {
			return;
		}
		if (cabinet.isStatus(AVAILABLE)) {
			cqrsCabinetService.addAvailableCabinet(cabinet);
		} else if (cabinet.isStatus(PENDING)) {
			cqrsCabinetService.addAvailableCabinet(cabinet);
		}
	}

	private void changeAvailableCabinet(Cabinet cabinet) {
		if (cabinet.isLentType(LentType.CLUB)) {
			return;
		}
		CabinetStatus status = cabinet.getStatus();
		if (status.equals(AVAILABLE) || status.equals(PENDING)) {
			cqrsCabinetService.addAvailableCabinet(cabinet);
		} else if (status.equals(FULL) || status.equals(IN_SESSION) || status.equals(BROKEN)) {
			cqrsCabinetService.removeAvailableCabinet(cabinet);
		}
	}

	/************************************* CabinetPerSection **************************************/

	private void syncCabinetPerSection(Cabinet cabinet, List<LentHistory> cabinetLentHistories) {
		cqrsCabinetService.addCabinetPerSection(cabinet);
		List<LentHistory> activeCabinetLentHistories = cabinetLentHistories.stream()
				.filter(l -> l.getEndedAt() == null).collect(Collectors.toList());
		activeCabinetLentHistories.forEach(lentHistory ->
				cqrsCabinetService.addLentHistoryOnCabinetPerSection(cabinet,
						lentHistory.getUser()));
	}

	private void changeCabinetPerSection(Cabinet cabinet) {
		cqrsCabinetService.addCabinetPerSection(cabinet);
	}

	private void changeCabinetPerSection(LentHistory lentHistory, Cabinet cabinet, User user) {
		if (lentHistory.getEndedAt() == null) {
			cqrsCabinetService.addLentHistoryOnCabinetPerSection(cabinet, user);
		} else {
			cqrsCabinetService.removeLentHistoryOnCabinetPerSection(cabinet, user);
		}
	}

	private void setSessionCabinetPerSection(Cabinet cabinet, List<User> users) {
		cqrsCabinetService.setSessionCabinetPerSection(cabinet, users);
	}

	private void removeSessionCabinetPerSection(Cabinet cabinet, List<Long> userIds) {
		cqrsCabinetService.removeSessionCabinetPerSection(cabinet, userIds);
	}

	/*************************************** userLentInfo *****************************************/

	private void syncUserLentInfo(Cabinet cabinet, List<LentHistory> lentHistories) {
		List<LentHistory> activeLentHistories = lentHistories.stream()
				.filter(lh -> lh.getEndedAt() == null).collect(Collectors.toList());

		if (activeLentHistories.isEmpty() && cabinet.isLentType(SHARE)) {
			List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinet.getId());
			this.setUserLentInfo(cabinet, usersInCabinet);
		} else {
			String previousUserName = lentRedisService.getPreviousUserName(cabinet.getId());
			cqrsUserService.addUserLentInfo(cabinet, activeLentHistories, previousUserName);
		}
	}

	private void changeUserLentInfo(Cabinet cabinet) {
		if (cabinet.isStatus(OVERDUE) || cabinet.isStatus(FULL)) {
			List<LentHistory> activeLentHistories =
					lentQueryService.findCabinetActiveLentHistories(cabinet.getId());
			String previousUserName = lentRedisService.getPreviousUserName(cabinet.getId());
			cqrsUserService.addUserLentInfo(cabinet, activeLentHistories, previousUserName);
		}
	}

	private void changeUserLentInfo(Cabinet cabinet, LentHistory lentHistory) {
		if (lentHistory.getEndedAt() != null) {
			List<Long> users = lentQueryService.findCabinetActiveLentHistories(cabinet.getId())
					.stream().map(LentHistory::getUserId).collect(Collectors.toList());
			cqrsUserService.removeUserLentInfo(lentHistory, users);
		} else if (cabinet.isLentType(PRIVATE)) {
			String previousUserName = lentRedisService.getPreviousUserName(cabinet.getId());
			cqrsUserService.addUserLentInfo(cabinet, List.of(lentHistory), previousUserName);
		}
	}

	private void setUserLentInfo(Cabinet cabinet, List<Long> usersInCabinet) {
		Long cabinetId = cabinet.getId();
		List<User> users = userQueryService.findUsers(usersInCabinet);
		String shareCode = lentRedisService.getShareCode(cabinetId);
		LocalDateTime expiredAt = lentRedisService.getSessionExpired(cabinetId);
		String prevUserName = lentRedisService.getPreviousUserName(cabinetId);

		cqrsUserService.setSessionUserLentInfo(cabinet, users, shareCode, expiredAt, prevUserName);
	}

	private void removeUserLentInfo(List<Long> usersInCabinet) {
		cqrsUserService.removeSessionUserLentInfo(usersInCabinet);
	}

	/************************************ userLentHistories ***************************************/

	private void syncUserLentHistories(Cabinet cabinet, List<LentHistory> lentHistories) {
		lentHistories.forEach(lentHistory -> {
			User user = lentHistory.getUser();
			cqrsUserService.addUserLentHistory(cabinet, lentHistory, user);
		});
	}

	private void changeUserLentHistories(Cabinet cabinet, LentHistory lentHistory, User user) {
		cqrsUserService.addUserLentHistory(cabinet, lentHistory, user);
	}
}
