package org.ftclub.cabinet.user.repository;

import java.util.List;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LentExtensionRepository extends JpaRepository<LentExtension, Long> {

	/**
	 * 특정 유저의 사용 가능한 연장권을 모두 가져옵니다.
	 *
	 * @param userId 유저의 아이디
	 * @return 사용 가능한 연장권 {@link List}.
	 */
	List<LentExtension> findAllByUserIdAndUsedAtIsNull(@Param("userId") Long userId);
}
