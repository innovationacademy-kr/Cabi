package org.ftclub.cabinet.item.repository;

import org.ftclub.cabinet.item.domain.ItemHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemHistoryRepository extends JpaRepository<ItemHistory, Long> {

}
