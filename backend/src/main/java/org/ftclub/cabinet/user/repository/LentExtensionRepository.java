package org.ftclub.cabinet.user.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LentExtensionRepository extends JpaRepository<LentExtension, Long> {

    @Query("SELECT le " +
            "FROM LentExtension le")
    Page<LentExtension> findAll(Pageable pageable);

    @Query("SELECT le " +
            "FROM LentExtension le " +
            "WHERE le.expiredAt > CURRENT_TIMESTAMP")
    Page<LentExtension> findAllNotExpired(Pageable pageable);

    @Query("SELECT le " +
            "FROM LentExtension le " +
            "WHERE le.userId =:userId ")
    List<LentExtension> findAllByUserId(@Param("userId") Long userId);
}
