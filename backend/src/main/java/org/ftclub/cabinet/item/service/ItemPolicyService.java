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
}
