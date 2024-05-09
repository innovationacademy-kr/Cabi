package org.ftclub.cabinet.alarm.handler;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmItem;
import org.ftclub.cabinet.alarm.domain.ExtensionItem;
import org.ftclub.cabinet.alarm.domain.ItemUsage;
import org.ftclub.cabinet.alarm.domain.PenaltyItem;
import org.ftclub.cabinet.alarm.domain.SwapItem;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.service.ItemFacadeService;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ItemUsageHandler {

	private final LentFacadeService lentFacadeService;
	private final UserFacadeService userFacadeService;
	private final ItemFacadeService itemFacadeService;

	@TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
	public void handleItemUsage(ItemUsage itemUsage) {
		if (itemUsage instanceof SwapItem) {
			SwapItem swapItem = (SwapItem) itemUsage;
			lentFacadeService.swapPrivateCabinet(swapItem.getUserId(), swapItem.getNewCabinetId());
		} else if (itemUsage instanceof PenaltyItem) {
			PenaltyItem penaltyItem = (PenaltyItem) itemUsage;
			userFacadeService.reduceBanDays(penaltyItem.getUserId(), penaltyItem.getDays());
		} else if (itemUsage instanceof ExtensionItem) {
			ExtensionItem extensionItem = (ExtensionItem) itemUsage;
			lentFacadeService.plusExtensionDays(extensionItem.getUserId(), extensionItem.getDays());
		} else if (itemUsage instanceof AlarmItem) {
			AlarmItem alarmItem = (AlarmItem) itemUsage;
			itemFacadeService.addSectionAlarm(alarmItem.getUserId(),
					alarmItem.getCabinetPlaceId(), alarmItem.getSectionAlarmType());
		} else {
			throw ExceptionStatus.NOT_FOUND_ITEM.asServiceException();
		}
	}
}
