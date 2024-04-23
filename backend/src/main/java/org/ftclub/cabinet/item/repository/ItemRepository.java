package org.ftclub.cabinet.item.repository;

import org.ftclub.cabinet.item.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Long, Item> {

}
