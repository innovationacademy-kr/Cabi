package org.ftclub.cabinet.user.domain;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.lent.domain.LentHistory;

public interface LentExtensionPolicy {

	void verifyLentExtension(Cabinet cabinet, List<LentHistory> lentHistories);

}
