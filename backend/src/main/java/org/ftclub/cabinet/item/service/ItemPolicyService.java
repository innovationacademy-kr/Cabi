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

	public void verifyIsAffordable(long userCoin, long itemPrice) {
		if (userCoin < itemPrice) {
			throw ExceptionStatus.NOT_ENOUGH_COIN.asServiceException();
		}
	}

	public void verifyIsAlreadyCollectedCoin(boolean isChecked) {
		if (isChecked) {
			throw ExceptionStatus.COIN_COLLECTION_ALREADY_EXIST.asServiceException();
		}
	}

	public ItemHistory verifyEmptyItems(List<ItemHistory> itemInInventory) {
		return itemInInventory.stream()
			.min(Comparator.comparing(ItemHistory::getPurchaseAt))
			.orElseThrow(ExceptionStatus.NOT_FOUND_ITEM::asServiceException);
	}

	public void verifyOnSale(long price) {
		if (price >= 0) {
			throw ExceptionStatus.ITEM_NOT_ON_SALE.asServiceException();
		}
	}
}
