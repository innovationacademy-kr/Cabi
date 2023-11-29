package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class BanPolicyImpl implements BanPolicy {

	private final BanHistoryRepository banHistoryRepository;

	@Override
	public BanType verifyForBanType(LentType lentType, LocalDateTime startAt, LocalDateTime endedAt,
			LocalDateTime expiredAt) {
		log.debug("Called verifyForBanType");
		if (checkAlreadyExpired(endedAt, expiredAt)) {
			return BanType.ALL;
		}
		return BanType.NONE;
	}

	@Override
	public LocalDateTime getBanDate(BanType banType, LocalDateTime endedAt, LocalDateTime expiredAt,
			Long userId) {
		log.debug("Called getBanDate");
		Double currentBanDays = DateUtil.calculateTwoDateDiffCeil(expiredAt, endedAt)
				.doubleValue();
		Double squaredBanDays = Math.pow(currentBanDays, 2.0);
		return endedAt.plusDays(squaredBanDays.longValue());
	}

	@Override
	public boolean checkAlreadyExpired(LocalDateTime endedAt, LocalDateTime expiredAt) {
		log.debug("Called checkAlreadyExpired");
		return expiredAt.isBefore(endedAt);
	}

	@Override
	public boolean isActiveBanHistory(LocalDateTime unbannedAt, LocalDateTime now) {
		log.debug("Called isActiveBanHistory");
		return now.isBefore(unbannedAt);
	}

	@Override
	public Long getAccumulateBanDaysByUserId(Long userId) {
		log.debug("Called getAccumulateBanDaysByUserId");
		List<BanHistory> banHistories = banHistoryRepository.findBanHistoriesByUserId(userId);
		Long accumulateDays = 0L;
		for (BanHistory history : banHistories) {
			accumulateDays += DateUtil.calculateTwoDateDiffAbs(history.getBannedAt(),
					history.getUnbannedAt());
		}
		return accumulateDays;
	}
}
