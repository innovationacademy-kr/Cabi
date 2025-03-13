package org.ftclub.cabinet.oauth.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.UserOauthConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OauthLinkRepository extends JpaRepository<UserOauthConnection, Long> {

	@Query("SELECT uc FROM UserOauthConnection uc "
			+ "JOIN FETCH uc.user "
			+ "WHERE uc.deletedAt IS NULL "
			+ "AND uc.providerId = :providerId "
			+ "AND uc.providerType = :providerType")
	Optional<UserOauthConnection> findByProviderIdAndProviderType(
			@Param("providerId") String providerId,
			@Param("providerType") String providerType);

	Optional<UserOauthConnection> findByProviderIdAndProviderTypeAndDeletedAtIsNull(
			String providerId, String providerType);

	Optional<UserOauthConnection> findByUserId(Long userId);

	boolean existsByProviderIdAndProviderType(String providerId, String providerType);

	boolean existsByUserIdAndDeletedAtIsNull(Long userId);

	void deleteByUserId(Long userId);
}
