package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.OauthLink;
import org.ftclub.cabinet.auth.repository.OauthLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OauthLinkCommandService {

	private final OauthLinkRepository repository;

	public void save(OauthLink connection) {
		repository.save(connection);
	}

	public void softDelete(OauthLink connection) {
		connection.generateDeletedAt();
		repository.save(connection);
	}
}
