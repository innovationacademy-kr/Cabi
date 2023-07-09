package org.ftclub.cabinet.utils.scheduler;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.user.service.UserService;
import org.ftclub.cabinet.utils.blackhole.manager.BlackholeManager;
import org.ftclub.cabinet.utils.leave.absence.LeaveAbsenceManager;
import org.ftclub.cabinet.utils.overdue.manager.OverdueManager;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 시스템 스케줄러
 */
@Component
@RequiredArgsConstructor
@EnableScheduling
@Log4j2
public class SystemScheduler {

	private final LeaveAbsenceManager leaveAbsenceManager;
	private final OverdueManager overdueManager;
	private final LentService lentService;
	private final UserService userService;
	private final BlackholeManager blackholeManager;

	/**
	 * 매일 자정마다 대여 기록을 확인하여, 연체 메일 발송 및 휴학생 처리를 트리거하는 메소드
	 */
	@Scheduled(cron = "0 0 0 * * *")
	public void checkAllLents() {
		log.info("called checkAllLents");
		List<ActiveLentHistoryDto> activeLents = lentService.getAllActiveLentHistories();
		for (ActiveLentHistoryDto activeLent : activeLents) {
			overdueManager.handleOverdue(activeLent);
			leaveAbsenceManager.handleLeaveAbsence(activeLent.getUserId(), activeLent.getName());
			// 2초 간격으로 대여 검증
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				log.error(e.getMessage());
			}
		}
	}

	/**
	 * 매주 월요일 자정 42분에 블랙홀에 빠진 유저 처리를 트리거하는 메소드
	 */
//	@Scheduled(cron = "0 42 0 * * MON")
	@Scheduled(initialDelay = 3000, fixedDelay = 1000 * 60 * 60 * 24 * 7)
	public void checkBlackHole() {
		log.info("called checkBlackHole");
		List<UserBlackholeInfoDto> blackHoledUsers = userService.getAllUserBlackholeInfo();
		for (UserBlackholeInfoDto blackHoledUser : blackHoledUsers) {
			blackholeManager.handleBlackhole(blackHoledUser);
			// 2초 간격으로 블랙홀 검증
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				log.error(e.getMessage());
			}
		}
	}
}