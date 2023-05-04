package org.ftclub.cabinet.lent.domain;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.User;

public interface LentPolicy {

	Date generateExpirationDate(Date now, LentType lentType, LentHistory lentHistory);

	LentPolicyStatus verifyUserForLent(User user, int userActiveLentCount);

	LentPolicyStatus verifyCabinetForLent(Cabinet cabinet, LentHistory cabinetLentHistory,
			Date now);

	Integer getDaysForLentTermPrivate();

	Integer getDaysForLentTermShare();

	Integer getDaysForNearExpiration();
}
