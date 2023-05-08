package org.ftclub.cabinet.user.domain;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.LentType;

public interface BanPolicy {

    BanType verifyForBanType(LentType lentType, Date startAt, Date endedAt, Date expiredAt);

    Date getBanDate(BanType banType, Date endedAt, Date expiredAt);

    boolean checkAlreadyExpired(Date endedAt, Date expiredAt);

    boolean isActiveBanHistory(Date unbannedAt, Date now);
}
