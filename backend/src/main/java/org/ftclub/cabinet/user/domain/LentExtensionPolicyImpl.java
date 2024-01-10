package org.ftclub.cabinet.user.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

// Policy가 인터페이스를 가져야 하는 이유..? (적용되는 정책은 하나일텐데)
// LentHistory의 static한 생성자로 인해서 서비스 자체에서 정책을 반영한 생성을 하기가 어려움. -> Policy를 팩토리처럼 사용하는 건?
@Log4j2
@Component
@RequiredArgsConstructor
public class LentExtensionPolicyImpl implements LentExtensionPolicy {
	private final static String DEFAULT_NAME = "lentExtension";
	private final CabinetProperties cabinetProperties;

	@Override
	public void verifyLentExtension(Cabinet cabinet, List<LentHistory> lentHistories) {
		log.debug("Called verifyLentExtension ");
		if (lentHistories.isEmpty()) {
			throw ExceptionStatus.NOT_FOUND_LENT_HISTORY.asServiceException();
		}

		if (cabinet.getLentType().equals(LentType.SHARE) && lentHistories.size() == 1) {
			throw ExceptionStatus.EXTENSION_SOLO_IN_SHARE_NOT_ALLOWED.asServiceException();
		}

		LentHistory lentHistory = lentHistories.get(0);
		LocalDateTime expiredAt = lentHistory.getExpiredAt();
		if (expiredAt.isBefore(LocalDateTime.now())) {
			throw ExceptionStatus.EXTENSION_LENT_DELAYED.asServiceException();
		}
	}

	@Override
	public int getDefaultExtensionTerm() {
		return cabinetProperties.getLentExtendTerm();
	}

	@Override
	public String getDefaultName() {
		return DEFAULT_NAME;
	}

	@Override
	public LocalDateTime getExpiry(LocalDateTime now) {
		return now.with(TemporalAdjusters.lastDayOfMonth())
				.withHour(23)
				.withMinute(59)
				.withSecond(0);
	}
}
