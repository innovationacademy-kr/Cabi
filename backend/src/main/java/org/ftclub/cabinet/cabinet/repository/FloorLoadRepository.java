package org.ftclub.cabinet.cabinet.repository;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.utils.annotations.ComplexRepository;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;

@ComplexRepository(entityClass = {Cabinet.class, LentHistory.class, User.class})
public interface FloorLoadRepository {

}
