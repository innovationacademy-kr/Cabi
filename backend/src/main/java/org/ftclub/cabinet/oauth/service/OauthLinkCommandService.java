package org.ftclub.cabinet.oauth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.oauth.repository.OauthLinkRepository;
import org.ftclub.cabinet.user.domain.UserOauthConnection;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OauthLinkCommandService {

	private final OauthLinkRepository repository;

	public void save(UserOauthConnection connection) {
		repository.save(connection);
	}

	public void softDelete(UserOauthConnection connection) {
		connection.generateDeletedAt();
		repository.save(connection);
	}
}
