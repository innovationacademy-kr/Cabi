package org.ftclub.cabinet.utils.scheduler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.discord.DiscordScheduleAlarmMessage;
import org.ftclub.cabinet.alarm.discord.DiscordWebHookMessenger;
import org.ftclub.cabinet.alarm.handler.SectionAlarmManager;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.exception.FtClubCabinetException;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.LentExtensionManager;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.ftclub.cabinet.utils.blackhole.manager.BlackholeManager;
import org.ftclub.cabinet.utils.overdue.manager.OverdueManager;
import org.ftclub.cabinet.utils.release.ReleaseManager;
import org.ftclub.cabinet.utils.slot.manager.PresentationSlotManager;
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

	private static final long DELAY_TIME = 2000;
	private static final String DEFAULT_ERROR_TITLE = "까비 스케줄러 작업 중 예기치 않은 오류가 발생했어요.🥲";
	private final UserQueryService userQueryService;
	private final LentExtensionManager lentExtensionManager;
	private final OverdueManager overdueManager;
	private final LentFacadeService lentFacadeService;
	private final BlackholeManager blackholeManager;
	private final ReleaseManager releaseManager;
	private final DiscordWebHookMessenger discordWebHookMessenger;
	private final SectionAlarmManager sectionAlarmManager;
	private final PresentationSlotManager presentationSlotManager;

	private void errorHandle(Exception e, DiscordScheduleAlarmMessage message) {
		if (!(e instanceof FtClubCabinetException)) {
			log.error("Error message: {}, Error occurred in scheduled task: ", message, e);
			discordWebHookMessenger.sendMessage(message);
		} else {
			log.warn("Handled FtClubCabinetException, no notification sent: ", e);
		}
	}

	/**
	 * 매일 자정마다 대여 기록을 확인하여, 연체 메일 발송 및 휴학생 처리를 트리거
	 */
	@Scheduled(cron = "${cabinet.schedule.cron.leave-absence}")
	public void checkAllLents() {
		log.info("called checkAllLents");
		List<ActiveLentHistoryDto> activeLents = lentFacadeService.getAllActiveLentHistories();
		for (ActiveLentHistoryDto activeLent : activeLents) {
			try {
				overdueManager.handleOverdue(activeLent);
			} catch (Exception e) {
				errorHandle(e, DiscordScheduleAlarmMessage.builder()
						.subject(DEFAULT_ERROR_TITLE)
						.taskName("연체 처리 작업")
						.taskMethodName("checkAllLents")
						.taskParameters(activeLent.toString())
						.build());
			}
/*
            leaveAbsenceManager.handleLeaveAbsence(activeLent.getUserId(), activeLent.getName());
            try {
                Thread.sleep(DELAY_TIME);
            } catch (InterruptedException e) {
                log.error(e.getMessage());
            }
*/
		}
	}

	/**
	 * 매주 월요일 자정 42분에 블랙홀에 빠진 유저 처리를 트리거하는 메소드 2초 간격으로 블랙홀 검증
	 */
	@Scheduled(cron = "${cabinet.schedule.cron.risk-of-blackhole}")
	public void checkRiskOfBlackhole() {
		log.info("called checkRiskOfBlackhole");
		List<UserBlackHoleEvent> closeWithBlackholeUsers = userQueryService.findUsersAtRiskOfBlackhole()
				.stream()
				.map(user -> UserBlackHoleEvent.of(user.getId(), user.getName(), user.getEmail(),
						user.getBlackholedAt()))
				.collect(Collectors.toList());
		for (UserBlackHoleEvent blackholeInfo : closeWithBlackholeUsers) {
			try {
				blackholeManager.handleBlackHole(blackholeInfo);
				Thread.sleep(DELAY_TIME);
			} catch (InterruptedException e) {
				log.warn(e.getMessage());
			} catch (Exception e) {
				errorHandle(e, DiscordScheduleAlarmMessage.builder()
						.subject(DEFAULT_ERROR_TITLE)
						.taskName("블랙홀 처리 작업 (예정자)")
						.taskMethodName("checkRiskOfBlackhole")
						.taskParameters(blackholeInfo.toString())
						.build());
			}
		}
	}

	/**
	 * 매월 1일 01시 42분에 블랙홀에 빠질 위험이 없는 유저들의 블랙홀 처리를 트리거하는 메소드 2초 간격으로 블랙홀 검증
	 */
	@Scheduled(cron = "${cabinet.schedule.cron.no-risk-of-blackhole}")
	public void checkNoRiskOfBlackhole() {
		log.info("called checkNoRiskOfBlackhole");

		List<UserBlackHoleEvent> safeFromBlackholeUsers = userQueryService.findUsersAtNoRiskOfBlackhole()
				.stream()
				.map(user -> UserBlackHoleEvent.of(user.getId(), user.getName(), user.getEmail(),
						user.getBlackholedAt()))
				.collect(Collectors.toList());

		for (UserBlackHoleEvent blackholeUserInfo : safeFromBlackholeUsers) {
			try {
				blackholeManager.handleBlackHole(blackholeUserInfo);
				Thread.sleep(DELAY_TIME);
			} catch (InterruptedException e) {
				log.warn(e.getMessage());
			} catch (Exception e) {
				errorHandle(e, DiscordScheduleAlarmMessage.builder()
						.subject(DEFAULT_ERROR_TITLE)
						.taskName("블랙홀 처리 작업 (전체)")
						.taskMethodName("checkNoRiskOfBlackhole")
						.taskParameters(blackholeUserInfo.toString())
						.build());
			}
		}
	}

	/**
	 * 매월 1일 01시 42분에 블랙홀에 빠질 위험이 없는 유저들의 블랙홀 처리를 트리거하는 메소드 2초 간격으로 블랙홀 검증
	 */
	//현재 5분마다 도는 로직  0 */5 * * * *
	@Scheduled(cron = "${cabinet.schedule.cron.cabinet-release-time}")
	public void releasePendingCabinet() {
		log.info("releasePendingCabinet {}", LocalDateTime.now());
		try {
			releaseManager.releasingCabinets();
		} catch (Exception e) {
			errorHandle(e, DiscordScheduleAlarmMessage.builder()
					.subject(DEFAULT_ERROR_TITLE)
					.taskName("Pending 사물함 Release 작업")
					.taskMethodName("releasePendingCabinet")
					.taskParameters("")
					.build());
		}
	}

	// 24 HANE 서비스가 종료됨에 따라 연관된 로직 주석 처리
//	@Scheduled(cron = "${cabinet.schedule.cron.extension-issue-time}")
//	public void lentExtensionIssue() {
//		log.info("called lentExtensionIssue");
//		try {
//			lentExtensionManager.issueLentExtension();
//		} catch (Exception e) {
//			errorHandle(e, DiscordScheduleAlarmMessage.builder()
//					.subject(DEFAULT_ERROR_TITLE)
//					.taskName("연장권 발급 작업")
//					.taskMethodName("lentExtensionIssue")
//					.taskParameters("")
//					.build());
//		}
//	}

//	@Scheduled(cron = "${cabinet.schedule.cron.extensible-user-check}")
//	public void checkUserQualifyForExtensible(){
//		log.info("called checkUserQualifyForExtensible");
//		List<UserMonthDataDto> userMonthDataDtos = occupiedTimeManager.metLimitTimeUser(occupiedTimeManager.getUserLastMonthOccupiedTime());
//		userService.updateUserExtensible(userMonthDataDtos);
//	}

	@Scheduled(cron = "${cabinet.schedule.cron.section-alarm-time}")
	public void sectionAlarm() {
		log.info("called sectionAlarm");
		sectionAlarmManager.sendSectionAlarm();
	}

	@Scheduled(cron = "${cabinet.schedule.cron.generate-presentation-slot}")
	public void generatePresentationSlots() {
		LocalDateTime now = LocalDateTime.now();
		log.info("Called createMonthlyPresentationSlots at {}", now);
		try {
			presentationSlotManager.generatePresentationSlotsMonthly();
		} catch (Exception e) {
			errorHandle(e, DiscordScheduleAlarmMessage.builder()
					.subject(DEFAULT_ERROR_TITLE)
					.taskName("월간 발표 슬롯 생성 작업")
					.taskMethodName("generatePresentationSlots")
					.taskParameters("Target month: " + now.plusMonths(3).getMonth())
					.build());
		}
	}
}
