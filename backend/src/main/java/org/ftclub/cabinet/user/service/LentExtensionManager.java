package org.ftclub.cabinet.user.service;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserMonthDataDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.service.ItemHistoryCommandService;
import org.ftclub.cabinet.item.service.ItemQueryService;
import org.ftclub.cabinet.item.service.ItemRedisService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.occupiedtime.OccupiedTimeManager;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.utils.lock.LockUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentExtensionManager {

	private final ItemHistoryCommandService itemHistoryCommandService;
	private final ItemQueryService itemQueryService;
	private final ItemRedisService itemRedisService;

	private final OccupiedTimeManager occupiedTimeManager;
	private final UserQueryService userQueryService;

	/**
	 * 연장권을 발급합니다.
	 */
	@Transactional
	public void issueLentExtension() {
		UserMonthDataDto[] userLastMonthOccupiedTime = occupiedTimeManager.getUserLastMonthOccupiedTime();
		List<UserMonthDataDto> userMonthDataDtos = occupiedTimeManager.filterToMetUserMonthlyTime(
				userLastMonthOccupiedTime);
		List<String> userNames = userMonthDataDtos.stream().map(UserMonthDataDto::getLogin)
				.collect(Collectors.toList());

		List<User> users = userQueryService.findAllUsersByNames(userNames);
		Item coinRewardItem = itemQueryService.getBySku(Sku.COIN_FULL_TIME);
		users.forEach(user -> {
			Long userId = user.getId();
			itemHistoryCommandService.createItemHistory(userId, coinRewardItem.getId());
			LockUtil.lockRedisCoin(userId, () ->
					saveCoinChangeOnRedis(userId, coinRewardItem.getPrice()));
		});
	}

	/**
	 * 재화 변동량을 Redis에 저장합니다.
	 *
	 * @param userId 유저 아이디
	 * @param price  변동량
	 */
	private void saveCoinChangeOnRedis(Long userId, long price) {
		// 유저 재화 변동량 Redis에 저장
		long userCoinCount = itemRedisService.getCoinCount(userId);
		itemRedisService.saveCoinCount(userId, userCoinCount + price);

		// 전체 재화 변동량 Redis에 저장
		long totalCoinSupply = itemRedisService.getTotalCoinSupply();
		itemRedisService.saveTotalCoinSupply(totalCoinSupply + price);
	}
}
