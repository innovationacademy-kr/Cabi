package org.ftclub.cabinet.lent.domain;

import java.util.Date;
import java.util.List;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;

public interface LentPolicy {

	Date generateExpirationDate(Date now, LentType lentType, LentHistory lentHistory, SetExpiredEnum setExpiredEnum);

	LentPolicyStatus verifyUserForLent(User user, Cabinet cabinet, int userActiveLentCount, List<BanHistory> userActiveBanList);

	LentPolicyDto verifyCabinetForLent(Cabinet cabinet, LentHistory cabinetLentHistory, int cabinetActiveLent,
									   Date now);

	Integer getDaysForLentTermPrivate();

	Integer getDaysForLentTermShare();

	Integer getDaysForNearExpiration();
}
