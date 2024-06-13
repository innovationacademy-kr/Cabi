package org.ftclub.cabinet.item.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.Sku;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

	@Query("SELECT i "
			+ "FROM Item i "
			+ "WHERE i.price > 0")
	List<Item> findAllByPricePositive();

	@Query("SELECT i "
			+ "FROM Item i "
			+ "WHERE i.price < 0")
	List<Item> findAllByPriceNegative();

	/**
	 * SKU (상품고유번호)로 상품 조회
	 *
	 * @param sku
	 * @return
	 */
	@Query("SELECT i "
			+ "FROM Item i "
			+ "WHERE i.sku = :sku")
	Optional<Item> findBySku(@Param("sku") Sku sku);
}
