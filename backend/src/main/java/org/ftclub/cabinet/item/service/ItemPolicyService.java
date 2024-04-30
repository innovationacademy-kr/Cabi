package org.ftclub.cabinet.item.service;

import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemPolicyService {

	private final ItemRedisService itemRedisService;

	public void verifyIsAffordable(long userCoin, long itemPrice) {
		if (userCoin < itemPrice) {
			throw ExceptionStatus.NOT_ENOUGH_COIN.asServiceException();
		}
	}

	public void verifyIsAlreadyCollectedCoin(Long userId) {
		if (itemRedisService.isCoinCollected(userId)) {
			throw ExceptionStatus.COIN_COLLECTION_ALREADY_EXIST.asServiceException();
		}
	}

	public ItemHistory verifyEmptyItems(List<ItemHistory> itemInInventory) {
		return itemInInventory.stream()
			.min(Comparator.comparing(ItemHistory::getPurchaseAt))
			.orElseThrow(ExceptionStatus.NOT_FOUND_ITEM::asServiceException);
	}
}
