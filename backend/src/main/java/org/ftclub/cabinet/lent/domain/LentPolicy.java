package org.ftclub.cabinet.lent.domain;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;

import java.util.Date;
import java.util.Optional;

public interface LentPolicy {
    Date generateExpirationDate(Date now, LentType lentType, LentHistory lentHistory);
    LentPolicyStatus verifyUserForLent(User user, int userLentCount);
    LentPolicyStatus verifyCabinetForLent(Cabinet cabinet, LentHistory cabinetLentHistory, Date now);
    Integer getDaysForLentTermPrivate();
    Integer getDaysForLentTermShare();
    Integer getDaysForNearExpiration();
}
