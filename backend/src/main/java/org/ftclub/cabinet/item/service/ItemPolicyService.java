package org.ftclub.cabinet.item.service;

import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;

@Service
public class ItemPolicyService {

	public void verifyIsAffordable(long userCoin, long itemPrice) {
		if (userCoin < itemPrice) {
			throw ExceptionStatus.NOT_ENOUGH_COIN.asServiceException();
		}
	}

	public void verifyOnSale(Long price) {
		if (price >= 0) {
			throw ExceptionStatus.ITEM_NOT_ON_SALE.asServiceException();
		}
	}
}
