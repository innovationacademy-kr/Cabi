package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.*;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionCommandService {
	private final LentExtensionRepository lentExtensionRepository;

	private final LentExtensionPolicy policy;
	private final CabinetProperties cabinetProperties;

	public LentExtension createLentExtension(User user, LentExtensionType type, LocalDateTime now) {
		log.debug("Called assignLentExtension {}", user.getName());
		LentExtension lentExtension = LentExtension.of(policy.getDefaultName(),
				policy.getDefaultExtensionTerm(),
				policy.getExpiry(now),
				type, user.getUserId());
		return lentExtensionRepository.save(lentExtension);
	}

	public void useLentExtension(LentExtension lentExtension, List<LentHistory> lentHistories) {
		log.debug("Called useLentExtension : {}", lentExtension.getLentExtensionId());

		lentExtension.use();
		lentHistories.forEach(lentHistory ->
				lentHistory.setExpiredAt(lentHistory.getExpiredAt().plusDays(lentExtension.getExtensionPeriod())));
	}
}
