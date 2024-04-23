package org.ftclub.cabinet.item.repository;

import java.util.List;
import org.ftclub.cabinet.item.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

	/**
	 * 모든 item을 조회한다.
	 *
	 * @return item {@Link List}
	 */
	@Query("SELECT p "
			+ "FROM Item p ")
	List<Item> findAllItems();
}
