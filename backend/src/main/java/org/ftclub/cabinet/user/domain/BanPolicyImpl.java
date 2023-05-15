package org.ftclub.cabinet.user.domain;

import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BanPolicyImpl implements BanPolicy {

	private final CabinetProperties cabinetProperties;

	@Override
	public BanType verifyForBanType(LentType lentType, Date startAt, Date endedAt, Date expiredAt) {
		if (checkAlreadyExpired(endedAt, expiredAt)) {
			return BanType.PRIVATE; // BanType을 BanType.ALL 과 같은 방식으로 바꿔도 좋을 것 같습니다.
		}
		if (lentType == LentType.SHARE) {
			Long dateDiff = DateUtil.calculateTwoDateDiffAbs(startAt, endedAt);
			if (dateDiff < cabinetProperties.getPenaltyDayShare()) {
				return BanType.SHARE;
			}
		}
		return BanType.NONE;
	}

	@Override
	public Date getBanDate(BanType banType, Date endedAt, Date expiredAt) {
		if (banType == BanType.SHARE) {
			return DateUtil.addDaysToDate(endedAt, cabinetProperties.getPenaltyDayShare());
		} else {
			int currentBan = DateUtil.calculateTwoDateDiffAbs(endedAt, expiredAt).intValue();
			return DateUtil.addDaysToDate(endedAt, currentBan);
		}
	}

	@Override
	public boolean checkAlreadyExpired(Date endedAt, Date expiredAt) {
		return expiredAt.before(endedAt);
	}

	@Override
	public boolean isActiveBanHistory(Date unbannedAt, Date now) {
		return now.before(unbannedAt);
	}
}
