package org.ftclub.cabinet.lent.domain;

import java.util.Date;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;

public interface LentPolicy {

	Date generateExpirationDate(Date now, Cabinet cabinet);

	void applyExpirationDate(LentHistory curHistory, List<LentHistory> beforeHistories,
			Date expiredAt);

	LentPolicyStatus verifyUserForLent(User user, Cabinet cabinet, int userActiveLentCount,
			List<BanHistory> userActiveBanList);

	LentPolicyStatus verifyCabinetForLent(Cabinet cabinet,
			List<LentHistory> cabinetLentHistories, Date now);

	Integer getDaysForLentTermPrivate();

	Integer getDaysForLentTermShare();

	Integer getDaysForNearExpiration();
}
