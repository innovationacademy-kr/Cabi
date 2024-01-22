package org.ftclub.cabinet.user.repository;

import java.util.List;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LentExtensionRepository extends JpaRepository<LentExtension, Long> {

	List<LentExtension> findAllByUserId(@Param("userId") Long userId);

	List<LentExtension> findAllByUserIdAndUsedAtIsNull(@Param("userId") Long userId);
}
