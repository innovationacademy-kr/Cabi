package org.ftclub.cabinet.item.service;

import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.ItemUseRequestDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.Sku;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemPolicyService {

	private static final Long REWARD_COUNT = 20L;

	public void verifyIsAffordable(long userCoin, long itemPrice) {
		if (userCoin <= 0 || userCoin < -itemPrice) {
			throw ExceptionStatus.NOT_ENOUGH_COIN.asServiceException();
		}
	}

	public void verifyIsAlreadyCollectedCoin(boolean isChecked) {
		if (isChecked) {
			throw ExceptionStatus.COIN_COLLECTION_ALREADY_EXIST.asServiceException();
		}
	}

	public ItemHistory verifyNotEmptyAndFindOldest(List<ItemHistory> itemInInventory) {
		return itemInInventory.stream()
				.min(Comparator.comparing(ItemHistory::getPurchaseAt))
				.orElseThrow(ExceptionStatus.ITEM_NOT_OWNED::asServiceException);
	}

	public void verifyOnSale(long price) {
		if (price >= 0) {
			throw ExceptionStatus.ITEM_NOT_ON_SALE.asServiceException();
		}
	}

	public void verifyDataFieldBySku(Sku sku, ItemUseRequestDto data) {
		if (sku.equals(Sku.ALARM) && (data.getBuilding() == null || data.getFloor() == null
				|| data.getSection() == null)) {
			throw ExceptionStatus.INVALID_ITEM_USE_REQUEST.asServiceException();
		}
		if (sku.equals(Sku.SWAP) && data.getNewCabinetId() == null) {
			throw ExceptionStatus.INVALID_ITEM_USE_REQUEST.asServiceException();
		}
	}

	public boolean isRewardable(Long monthlyCoinCount) {
		return monthlyCoinCount.equals(REWARD_COUNT);
	}

	public Sku getRewardSku(int randomPercentage) {
		if (randomPercentage < 50) {
			return Sku.COIN_REWARD_200;
		} else if (randomPercentage < 80) {
			return Sku.COIN_REWARD_500;
		} else if (randomPercentage < 95) {
			return Sku.COIN_REWARD_1000;
		} else {
			return Sku.COIN_REWARD_2000;
		}
	}

	public void verifyCoinAmount(Long amount) {
		if (amount == null) {
			throw ExceptionStatus.INVALID_AMOUNT.asServiceException();
		}
	}
}
