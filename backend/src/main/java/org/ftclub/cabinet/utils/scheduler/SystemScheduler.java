package org.ftclub.cabinet.utils.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.occupiedtime.OccupiedTimeManager;
import org.ftclub.cabinet.user.service.LentExtensionManager;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.ftclub.cabinet.utils.blackhole.manager.BlackholeManager;
import org.ftclub.cabinet.utils.leave.absence.LeaveAbsenceManager;
import org.ftclub.cabinet.utils.overdue.manager.OverdueManager;
import org.ftclub.cabinet.utils.release.ReleaseManager;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 시스템 스케줄러
 */
@Component
@RequiredArgsConstructor
@EnableScheduling
@Log4j2
public class SystemScheduler {

    private static final long DELAY_TIME = 2000;
    private final UserQueryService userQueryService;
    private final LeaveAbsenceManager leaveAbsenceManager;
    private final LentExtensionManager lentExtensionManager;
    private final OverdueManager overdueManager;
    private final LentFacadeService lentFacadeService;
    private final BlackholeManager blackholeManager;
    private final ReleaseManager releaseManager;
    private final OccupiedTimeManager occupiedTimeManager;

    /**
     * 매일 자정마다 대여 기록을 확인하여, 연체 메일 발송 및 휴학생 처리를 트리거하는 메소드 2초 간격으로 블랙홀 검증
     */
    @Scheduled(cron = "${cabinet.schedule.cron.leave-absence}")
    public void checkAllLents() {
        log.info("called checkAllLents");
        List<ActiveLentHistoryDto> activeLents = lentFacadeService.getAllActiveLentHistories();
        for (ActiveLentHistoryDto activeLent : activeLents) {
            overdueManager.handleOverdue(activeLent);
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

        List<UserBlackHoleEvent> closeWithBlackholeUsers = userQueryService.findAllRiskOfBlackholeInfo().stream()
                .map(user -> UserBlackHoleEvent.of(user.getId(), user.getName(), user.getEmail(), user.getBlackholedAt()))
                .collect(Collectors.toList());
        for (UserBlackHoleEvent blackholeInfo : closeWithBlackholeUsers) {
            blackholeManager.handleBlackHole(blackholeInfo);
            try {
                Thread.sleep(DELAY_TIME);
            } catch (InterruptedException e) {
                log.error(e.getMessage());
            }
        }
    }

    /**
     * 매월 1일 01시 42분에 블랙홀에 빠질 위험이 없는 유저들의 블랙홀 처리를 트리거하는 메소드 2초 간격으로 블랙홀 검증
     */
    @Scheduled(cron = "${cabinet.schedule.cron.no-risk-of-blackhole}")
    public void checkNoRiskOfBlackhole() {
        log.info("called checkNoRiskOfBlackhole");

        List<UserBlackHoleEvent> safeFromBlackholeUsers = userQueryService.findAllNoRiskOfBlackholeInfo()
                .stream()
                .map(user -> UserBlackHoleEvent.of(user.getId(), user.getName(), user.getEmail(), user.getBlackholedAt()))
                .collect(Collectors.toList());

        for (UserBlackHoleEvent blackholeUserInfo : safeFromBlackholeUsers) {
            blackholeManager.handleBlackHole(blackholeUserInfo);
            try {
                Thread.sleep(DELAY_TIME);
            } catch (InterruptedException e) {
                log.error(e.getMessage());
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
        releaseManager.releasingCabinets();
    }

    @Scheduled(cron = "${cabinet.schedule.cron.extension-issue-time}")
    public void lentExtensionIssue() {
        log.info("called lentExtensionIssue");
        lentExtensionManager.issueLentExtension();
    }

//	@Scheduled(cron = "${cabinet.schedule.cron.extensible-user-check}")
//	public void checkUserQualifyForExtensible(){
//		log.info("called checkUserQualifyForExtensible");
//		List<UserMonthDataDto> userMonthDataDtos = occupiedTimeManager.metLimitTimeUser(occupiedTimeManager.getUserLastMonthOccupiedTime());
//		userService.updateUserExtensible(userMonthDataDtos);
//	}
}
