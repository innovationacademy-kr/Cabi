package org.ftclub.cabinet.item.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemHistoryRepository extends JpaRepository<ItemHistory, Long> {

	@Query("SELECT ih "
			+ "FROM ItemHistory ih "
			+ "WHERE ih.userId = :userId "
			+ "AND ih.purchaseAt BETWEEN :start AND :end "
			+ "AND ih.itemId IN (:itemIds)")
	List<ItemHistory> findAllByUserIdAndPurchaseAtAndItemIdIn(@Param("userId") Long userId,
			@Param("start") LocalDateTime start, @Param("end") LocalDateTime end,
			@Param("itemIds") List<Long> itemIds);
}
