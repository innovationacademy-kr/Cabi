package org.ftclub.cabinet.cabinet.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import javax.persistence.EntityManager;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.utils.annotations.ComplexRepository;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;

@ComplexRepository(entityClass = {Cabinet.class, CabinetPlace.class, LentHistory.class, User.class})
public class FloorLoadRepositoryImpl implements FloorLoadRepository {

	private final JPAQueryFactory queryFactory;

	public FloorLoadRepositoryImpl(EntityManager em) {
		this.queryFactory = new JPAQueryFactory(em);
	}

}
