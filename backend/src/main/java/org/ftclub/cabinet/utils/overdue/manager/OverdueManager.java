package org.ftclub.cabinet.utils.overdue.manager;

import javax.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Logging
/**
 * 연체 관리자 클래스
 *
 * TODO: 추후 다른 알림 방식(슬랙봇, 푸쉬 알림 등)으로 연체 알림을 발송하게 될 수 있으므로
 *       해당 클래스가 MailSender에 의존하지 않도록 리팩토링할 것
 */
public class OverdueManager {

	private final CabinetFacadeService cabinetFacadeService;
	private final AlarmProperties alarmProperties;
	private final ApplicationEventPublisher eventPublisher;


	/**
	 * 연체 타입을 반환하는 메소드 연체 예정인 경우, SOON_OVERDUE를 반환하고, 연체 기간이 지난 경우, OVERDUE를 반환한다. 그 외의 경우, NONE을
	 * 반환한다.
	 *
	 * @param isExpired              연체 기간이 지났는지 여부 (true: 연체 기간이 지남, false: 연체 기간이 지나지 않음)
	 * @param daysLeftFromExpireDate 만료일로부터 남은 일수 (null: 만료일이 없음)
	 * @return 연체 타입
	 */
	private OverdueType getOverdueType(Boolean isExpired, @Nullable Long daysLeftFromExpireDate) {
		if (isExpired) {
			return OverdueType.OVERDUE;
		}
		if (daysLeftFromExpireDate == null) {
			return OverdueType.NONE;
		}
		if (daysLeftFromExpireDate.equals(alarmProperties.getOverdueTermWeekBefore())) {
			return OverdueType.SOON_OVERDUE;
		}
		if (daysLeftFromExpireDate.equals(alarmProperties.getOverdueTermThreeDaysBefore())) {
			return OverdueType.SOON_OVERDUE;
		}
		if (daysLeftFromExpireDate.equals(alarmProperties.getOverdueTermSoonOverdue())) {
			return OverdueType.SOON_OVERDUE;
		}
		if (daysLeftFromExpireDate >= alarmProperties.getOverdueTermOverdue()) {
			return OverdueType.OVERDUE;
		}
		return OverdueType.NONE;
	}

	public void handleOverdue(ActiveLentHistoryDto activeLent) {
		OverdueType overdueType =
				getOverdueType(activeLent.getIsExpired(), activeLent.getDaysFromExpireDate());
		switch (overdueType) {
			case NONE:
				return;
			case SOON_OVERDUE:
				eventPublisher.publishEvent(AlarmEvent.of(activeLent.getUserId(),
						new LentExpirationImminentAlarm(activeLent.getDaysFromExpireDate())));
				break;
			case OVERDUE:
				cabinetFacadeService.updateStatus(activeLent.getCabinetId(),
						CabinetStatus.OVERDUE);
				eventPublisher.publishEvent(AlarmEvent.of(activeLent.getUserId(),
						new LentExpirationAlarm(activeLent.getDaysFromExpireDate())));
				break;
		}
	}
}
