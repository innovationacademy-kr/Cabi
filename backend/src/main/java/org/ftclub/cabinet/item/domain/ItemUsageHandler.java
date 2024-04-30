package org.ftclub.cabinet.item.domain;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ItemUsageHandler {

	private final LentFacadeService lentFacadeService;
	private final UserFacadeService userFacadeService;

	@EventListener
	public void handleItemUsage(ItemUsage itemUsage) {
		if (itemUsage instanceof SwapItem) {
			SwapItem swapItem = (SwapItem) itemUsage;
			lentFacadeService.swapPrivateCabinet(swapItem.getUserId(), swapItem.getNewCabinetId());
		}
		if (itemUsage instanceof PenaltyItem) {
			PenaltyItem penaltyItem = (PenaltyItem) itemUsage;
			userFacadeService.reduceBanDays(penaltyItem.getUserId(), penaltyItem.getDays());
		}
	}
}
