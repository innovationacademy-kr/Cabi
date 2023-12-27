package org.ftclub.cabinet.admin.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.LentExtensionCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Log4j2
public class AdminLentExtensionFacadeService {
	private final UserQueryService userQueryService;
	private final LentExtensionCommandService lentExtensionCommandService;

	// TODO : 더 세부적으로 구현해야함
	public void assignLentExtension(String username) {
		log.info("Called assigneLentExtension: {}", username);
		LocalDateTime now = LocalDateTime.now();
		User user = userQueryService.getUserByName(username);
		lentExtensionCommandService.createLentExtension(user, LentExtensionType.ALL, now);
	}
}
