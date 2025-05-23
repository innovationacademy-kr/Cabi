package org.ftclub.cabinet.auth.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.auth.domain.OauthLink;
import org.ftclub.cabinet.auth.repository.OauthLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OauthLinkQueryService {

	private final OauthLinkRepository oauthLinkRepository;

	public OauthLink getById(Long userConnectionId) {
		return oauthLinkRepository.findById(userConnectionId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
	}

	public Optional<OauthLink> findByProviderIdAndProviderType(String name, String type) {
		return oauthLinkRepository.findByProviderIdAndProviderTypeWithUser(name, type);
	}

	public boolean isExistByUserId(Long userId) {
		return oauthLinkRepository.existsByUserIdAndDeletedAtIsNull(userId);
	}

	public OauthLink getByUserId(Long userId) {
		return oauthLinkRepository.findByUserIdAndDeletedAtIsNull(userId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_OAUTH_CONNECTION::asServiceException);
	}

	public Optional<OauthLink> findByUserId(Long userId) {
		return oauthLinkRepository.findByUserIdAndDeletedAtIsNull(userId);
	}
}
