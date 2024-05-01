package org.ftclub.cabinet.item.domain;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ItemUsageHandler {

	private final LentFacadeService lentFacadeService;
	private final UserFacadeService userFacadeService;

	@TransactionalEventListener
	public void handleItemUsage(ItemUsage itemUsage) {
		if (itemUsage instanceof SwapItem) {
			SwapItem swapItem = (SwapItem) itemUsage;
			lentFacadeService.swapPrivateCabinet(swapItem.getUserId(), swapItem.getNewCabinetId());
		}
		if (itemUsage instanceof PenaltyItem) {
			PenaltyItem penaltyItem = (PenaltyItem) itemUsage;
			userFacadeService.reduceBanDays(penaltyItem.getUserId(), penaltyItem.getDays());
		}
		if (itemUsage instanceof ExtensionItem) {
			ExtensionItem extensionItem = (ExtensionItem) itemUsage;
			lentFacadeService.plusExtensionDays(extensionItem.getUserId(), extensionItem.getDays());
		}
	}
}
