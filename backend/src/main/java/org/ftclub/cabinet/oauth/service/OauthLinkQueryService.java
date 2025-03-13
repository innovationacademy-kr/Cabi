package org.ftclub.cabinet.oauth.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.oauth.repository.OauthLinkRepository;
import org.ftclub.cabinet.user.domain.UserOauthConnection;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OauthLinkQueryService {

	private final OauthLinkRepository oauthLinkRepository;

	public UserOauthConnection getById(Long userConnectionId) {
		return oauthLinkRepository.findById(userConnectionId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
	}

	public Optional<UserOauthConnection> findByProviderIdAndProviderType(String name, String type) {
		return oauthLinkRepository.findByProviderIdAndProviderType(name, type);
	}

	public boolean isExistByUserId(Long userId) {
		return oauthLinkRepository.existsByUserIdAndDeletedAtIsNull(userId);
	}

	public UserOauthConnection getByUserId(Long userId) {
		return oauthLinkRepository.findByUserId(userId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_OAUTH_CONNECTION::asServiceException);
	}

	public Optional<UserOauthConnection> findByUserId(Long userId) {
		return oauthLinkRepository.findByUserId(userId);
	}
}
