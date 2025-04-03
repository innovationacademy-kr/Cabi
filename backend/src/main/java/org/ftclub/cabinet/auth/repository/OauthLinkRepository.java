package org.ftclub.cabinet.auth.repository;

import java.util.Optional;
import org.ftclub.cabinet.auth.domain.OauthLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OauthLinkRepository extends JpaRepository<OauthLink, Long> {

	@Query("SELECT uc FROM OauthLink uc "
			+ "JOIN FETCH uc.user "
			+ "WHERE uc.deletedAt IS NULL "
			+ "AND uc.providerId = :providerId "
			+ "AND uc.providerType = :providerType")
	Optional<OauthLink> findByProviderIdAndProviderTypeWithUser(
			@Param("providerId") String providerId,
			@Param("providerType") String providerType);

	Optional<OauthLink> findByProviderIdAndProviderTypeAndDeletedAtIsNull(
			String providerId, String providerType);


	Optional<OauthLink> findByUserIdAndDeletedAtIsNull(Long userId);

	boolean existsByProviderIdAndProviderType(String providerId, String providerType);

	boolean existsByUserIdAndDeletedAtIsNull(Long userId);

	void deleteByUserId(Long userId);
}
