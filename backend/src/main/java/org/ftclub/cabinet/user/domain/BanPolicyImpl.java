package org.ftclub.cabinet.user.domain;

import java.util.Date;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Component;

@Component
public class BanPolicyImpl implements BanPolicy {

    @Override
    public int checkBan(Date endedAt, Date expiredAt) {
        long diff = expiredAt.getTime() - endedAt.getTime();
        if (diff < 0) {
            return DateUtil.calculateTwoDateDiffAbs(endedAt, expiredAt).intValue();
        }
        return -1;
    }
}
