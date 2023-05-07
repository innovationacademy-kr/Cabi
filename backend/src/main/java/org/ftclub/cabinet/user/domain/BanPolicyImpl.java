package org.ftclub.cabinet.user.domain;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class BanPolicyImpl implements BanPolicy {

    @Value("${cabinet.penalty.day.share}")
    private static Integer PENALTY_DAY_SHARE;

    @Override
    public BanType verifyForBanType(LentType lentType, Date startAt, Date endedAt, Date expiredAt) {
        if (lentType == LentType.PRIVATE) {
            if (expiredAt.before(endedAt)) {
                return BanType.PRIVATE;
            }
        }
        if (lentType == LentType.SHARE) {
            if (expiredAt.before(endedAt)) {
                return BanType.PRIVATE;
            }
            Long dateDiff = DateUtil.calculateTwoDateDiffAbs(startAt, endedAt);
            if (dateDiff < PENALTY_DAY_SHARE) {
                return BanType.SHARE;
            }
        }
        return BanType.NONE;
    }

    @Override
    public Date getBanDate(BanType banType, Date endedAt, Date expiredAt) {
        if (banType == BanType.SHARE) {
            return DateUtil.addDaysToDate(endedAt, PENALTY_DAY_SHARE);
        } else {
            int currentBan = DateUtil.calculateTwoDateDiffAbs(endedAt, expiredAt).intValue();
            return DateUtil.addDaysToDate(endedAt, currentBan);
        }
    }
}
