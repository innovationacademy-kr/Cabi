package org.ftclub.cabinet.user.domain;

import java.util.Date;

public interface BanPolicy {

    int checkBan(Date endedAt, Date expiredAt);
}
