package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionPolicy;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
}
