package org.ftclub.cabinet.item.repository;

import java.util.List;
import org.ftclub.cabinet.item.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

	@Query("SELECT i "
			+ "FROM Item i "
			+ "WHERE i.price >= 0")
	List<Item> findAllByPricePositive();

	@Query("SELECT i "
			+ "FROM Item i "
			+ "WHERE i.price < 0")
	List<Item> findAllByPriceNegative();
}
