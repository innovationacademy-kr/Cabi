package org.ftclub.cabinet.utils.scheduler;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.lent.service.LentService;
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
public class SystemScheduler {

	private final LeaveAbsenceManager leaveAbsenceManager;
	private final OverdueManager overdueManager;
	private final LentService lentService;

	/**
	 * 매일 자정마다 대여 기록을 확인하여, 연체 메일 발송 및 휴학생 처리를 트리거하는 메소드
	 */
	// Every Midnight
//	@Scheduled(cron = "0 0 0 * * *")
	@Scheduled(initialDelay = 3000, fixedDelay = 1000 * 60 * 60 * 24)
	public void checkAllLents() {
		List<ActiveLentHistoryDto> activeLents = this.lentService.getAllActiveLentHistories();
		for (ActiveLentHistoryDto activeLent : activeLents) {
			System.out.println(activeLent);
			overdueManager.handleOverdue(activeLent);
			leaveAbsenceManager.handleLeaveAbsence(activeLent.getUserId(), activeLent.getName());
			// 2초 간격으로 대여 검증
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}