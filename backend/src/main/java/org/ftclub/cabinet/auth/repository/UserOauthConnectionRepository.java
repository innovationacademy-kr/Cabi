package org.ftclub.cabinet.auth.repository;

import java.util.Optional;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserOauthConnectionRepository extends JpaRepository<UserOauthConnection, Long> {

	Optional<UserOauthConnection> findByProviderIdAndProviderType(String providerId,
			String providerType);

	Optional<UserOauthConnection> findByUserId(Long userId);

	boolean existsByProviderIdAndProviderType(String providerId, String providerType);

	boolean existsByUserId(Long userId);
}
