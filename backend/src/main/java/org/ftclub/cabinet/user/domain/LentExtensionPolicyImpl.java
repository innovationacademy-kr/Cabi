package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class LentExtensionPolicyImpl implements LentExtensionPolicy {

	@Override
	public void verifyLentExtension(Cabinet cabinet, List<LentHistory> lentHistories) {
		log.debug("Called verifyLentExtension ");
		if (lentHistories.isEmpty()) {
			throw new DomainException(ExceptionStatus.NOT_FOUND_LENT_HISTORY);
		}

		if (cabinet.getLentType().equals(LentType.SHARE) && lentHistories.size() == 1) {
			throw new DomainException(ExceptionStatus.EXTENSION_SOLO_IN_SHARE_NOT_ALLOWED);
		}

		LentHistory lentHistory = lentHistories.get(0);
		LocalDateTime expiredAt = lentHistory.getExpiredAt();
		if (expiredAt.isBefore(LocalDateTime.now())) {
			throw new DomainException(ExceptionStatus.EXTENSION_LENT_DELAYED);
		}
	}
}
