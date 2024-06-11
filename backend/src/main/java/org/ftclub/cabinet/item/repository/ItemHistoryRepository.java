package org.ftclub.cabinet.item.repository;

import java.time.LocalDate;
import java.util.List;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemHistoryRepository extends JpaRepository<ItemHistory, Long> {

	@Query("SELECT ih "
			+ "FROM ItemHistory ih "
			+ "WHERE ih.userId = :userId "
			+ "AND ih.itemId IN (:itemIds) "
			+ "ORDER BY ih.purchaseAt DESC")
	Page<ItemHistory> findAllByUserIdAndItemIdIn(@Param("userId") Long userId,
			Pageable pageable, @Param("itemIds") List<Long> itemIds);

	@Query(value = "SELECT ih "
			+ "FROM ItemHistory ih "
			+ "JOIN FETCH ih.item i "
			+ "WHERE ih.userId = :userId "
			+ "AND ih.usedAt IS NOT NULL "
			+ "AND i.price < 0 "
			+ "ORDER BY ih.usedAt DESC",
			countQuery = "SELECT COUNT(ih) "
					+ "FROM ItemHistory ih "
					+ "JOIN ih.item i "
					+ "WHERE ih.userId = :userId "
					+ "AND ih.usedAt IS NOT NULL "
					+ "AND i.price < 0")
	Page<ItemHistory> findAllByUserIdOnMinusPriceItemsWithSubQuery(
			@Param("userId") Long userId, Pageable pageable);

	@EntityGraph(attributePaths = "item")
	Page<ItemHistory> findAllByUserIdOrderByPurchaseAtDesc(Long userId, Pageable pageable);

	@Query("SELECT ih "
			+ "FROM ItemHistory ih "
			+ "JOIN FETCH ih.item "
			+ "WHERE ih.userId = :userId")
	List<ItemHistory> findAllByUserId(@Param("userId") Long userId);

	@Query(value = "SELECT SUM(i.price) "
			+ "FROM ItemHistory ih "
			+ "JOIN ih.item i "
			+ "WHERE i.price < 0")
	long getPriceSumOnMinusPriceItems();

	@Query(value = "SELECT SUM(i.price) "
			+ "FROM ItemHistory ih "
			+ "JOIN ih.item i "
			+ "WHERE i.price > 0")
	long getPriceSumOnPlusPriceItems();

	@Query("SELECT ih "
			+ "FROM ItemHistory ih "
			+ "JOIN FETCH ih.item "
			+ "WHERE ih.userId = :userId "
			+ "AND ih.usedAt IS NULL "
	)
	List<ItemHistory> getAllUnusedItemHistoryByUser(@Param("userId") Long userId);

	List<ItemHistory> findAllByUserIdAndItemIdAndUsedAtIsNull(Long userId, Long itemId);


	@Query("SELECT ih "
			+ "FROM ItemHistory ih "
			+ "WHERE ih.itemId = :itemId "
			+ "AND YEAR(ih.purchaseAt) = :year "
			+ "AND MONTH(ih.purchaseAt) = :month "
	)
	List<ItemHistory> findCoinCollectInfoByIdAtYearAndMonth(@Param("itemId") Long itemId,
			@Param("year") Integer year, @Param("month") Integer month);

	@Query("SELECT COUNT(ih) "
			+ "FROM ItemHistory ih "
			+ "WHERE ih.itemId = :itemId")
	int getCountByItemIds(@Param("itemId") Long itemId);

	@Query("SELECT ih "
			+ "FROM ItemHistory ih "
			+ "JOIN FETCH ih.item "
			+ "WHERE DATE(ih.purchaseAt) >= DATE(:start) "
			+ "AND DATE(ih.purchaseAt) <= DATE(:end)"
	)
	List<ItemHistory> findAllUsedAtIsNotNullBetween(
			@Param("start") LocalDate startDate,
			@Param("end") LocalDate endDate);
}
