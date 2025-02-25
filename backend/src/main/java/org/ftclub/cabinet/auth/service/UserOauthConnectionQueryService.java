package org.ftclub.cabinet.auth.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.ftclub.cabinet.auth.repository.UserOauthConnectionRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserOauthConnectionQueryService {

	private final UserOauthConnectionRepository userOauthConnectionRepository;

	public UserOauthConnection getById(Long userConnectionId) {
		return userOauthConnectionRepository.findById(userConnectionId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
	}

	public Optional<UserOauthConnection> findByProviderIdAndProviderType(String name, String type) {
		return userOauthConnectionRepository.findByProviderIdAndProviderType(name, type);
	}

	public boolean isExistByOauthIdAndType(String oauthId, String type) {
		return userOauthConnectionRepository.existsByProviderIdAndProviderType(oauthId, type);
	}

	public boolean isExistByUserId(Long userId) {
		return userOauthConnectionRepository.existsByUserId(userId);
	}

	public Optional<UserOauthConnection> getByUserId(Long userId) {
		return userOauthConnectionRepository.findByUserId(userId);
	}
}
