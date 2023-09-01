package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class BanPolicyImpl implements BanPolicy {

	private final CabinetProperties cabinetProperties;
	private final BanHistoryRepository banHistoryRepository;

	@Override
	public BanType verifyForBanType(LentType lentType, LocalDateTime startAt, LocalDateTime endedAt,
			LocalDateTime expiredAt) {
		log.debug("Called verifyForBanType");
		if (checkAlreadyExpired(endedAt, expiredAt)) {
			return BanType.ALL;
		}
		//share BAN 비활성화
//		if (lentType == LentType.SHARE) {
//			Long dateDiff = DateUtil.calculateTwoDateDiffAbs(startAt, endedAt);
//			if (dateDiff < cabinetProperties.getPenaltyDayShare()) {
//				return BanType.SHARE;
//			}
//		}
		return BanType.NONE;
	}

	@Override
	public LocalDateTime getBanDate(BanType banType, LocalDateTime endedAt, LocalDateTime expiredAt,
			Long userId) {
		log.debug("Called getBanDate");
//		if (banType == BanType.SHARE) {
//			return endedAt.plusDays(cabinetProperties.getPenaltyDayShare());
//		} else {
//		Double currentBanDays = DateUtil.calculateTwoDateDiffAbs(endedAt, expiredAt)
//				.doubleValue() + 1;
		Double currentBanDays = DateUtil.calculateTwoDateDiffCeil(endedAt, expiredAt)
				.doubleValue();
//			int accumulateBanDays = getAccumulateBanDaysByUserId(userId).intValue();
		Double squaredBanDays = Math.pow(currentBanDays, 2.0);
		System.out.println("squaredBanDays = " + squaredBanDays);
		return endedAt.plusDays(squaredBanDays.longValue());
//		}
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
