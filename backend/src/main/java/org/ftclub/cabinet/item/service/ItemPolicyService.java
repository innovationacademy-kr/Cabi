package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
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
}
