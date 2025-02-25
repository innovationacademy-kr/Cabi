package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.ftclub.cabinet.auth.repository.UserOauthConnectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserOauthConnectionCommandService {

	private final UserOauthConnectionRepository repository;

	public void save(UserOauthConnection connection) {
		repository.save(connection);
	}
}
