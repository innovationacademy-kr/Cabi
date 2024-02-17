package org.ftclub.cabinet.user.domain;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.lent.domain.LentHistory;

import java.time.LocalDateTime;
import java.util.List;

public interface LentExtensionPolicy {

	void verifyLentExtension(Cabinet cabinet, List<LentHistory> lentHistories);

	String getDefaultName();

	int getDefaultExtensionTerm();

	LocalDateTime getExpiry(LocalDateTime now);
}
