package org.ftclub.cabinet.auth.repository;

import java.util.Optional;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserOauthConnectionRepository extends JpaRepository<UserOauthConnection, Long> {

	@Query("SELECT uc FROM UserOauthConnection uc "
			+ "JOIN FETCH uc.user "
			+ "WHERE uc.providerId = :providerId "
			+ "AND uc.providerType = :providerType")
	Optional<UserOauthConnection> findByProviderIdAndProviderType(
			@Param("providerId") String providerId,
			@Param("providerType") String providerType);

	Optional<UserOauthConnection> findByUserId(Long userId);

	boolean existsByProviderIdAndProviderType(String providerId, String providerType);

	boolean existsByUserId(Long userId);

	void deleteByUserId(Long userId);
}
