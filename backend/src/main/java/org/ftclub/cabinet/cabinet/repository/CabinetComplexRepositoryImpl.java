package org.ftclub.cabinet.cabinet.repository;

import static org.ftclub.cabinet.cabinet.domain.QCabinet.cabinet;
import static org.ftclub.cabinet.cabinet.domain.QCabinetPlace.cabinetPlace;
import static org.ftclub.cabinet.lent.domain.QLentHistory.lentHistory;
import static org.ftclub.cabinet.user.domain.QUser.user;

import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import javax.persistence.EntityManager;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.dto.QActiveCabinetInfoEntities;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;

@CacheConfig(cacheNames = "cabinets")
public class CabinetComplexRepositoryImpl implements CabinetComplexRepository {

	private final JPAQueryFactory queryFactory;

	public CabinetComplexRepositoryImpl(EntityManager em) {
		this.queryFactory = new JPAQueryFactory(em);
	}

	// CACHE
	@Cacheable(key = "#building + #floor")
	public List<Cabinet> findAllCabinetsByBuildingAndFloor(String building, Integer floor) {
		JPAQuery<Cabinet> query = queryFactory.selectFrom(cabinet)
				.join(cabinetPlace)
				.on(cabinet.cabinetPlace.cabinetPlaceId.eq(cabinetPlace.cabinetPlaceId))
				.where(cabinetPlace.location.building
						.eq(building)
						.and(cabinetPlace.location.floor.eq(floor))
				);
		return query.fetch();
	}

	@Override
	public List<ActiveCabinetInfoEntities> findCabinetsActiveLentHistoriesByBuildingAndFloor(
			String building, Integer floor) {
		return queryFactory.selectDistinct(
						new QActiveCabinetInfoEntities(cabinet, lentHistory, user))
				.from(cabinet)
				.join(cabinetPlace)
				.on(cabinet.cabinetPlace.cabinetPlaceId.eq(cabinetPlace.cabinetPlaceId))
				.join(lentHistory)
				.on(cabinet.cabinetId.eq(lentHistory.cabinet.cabinetId))
				.join(user)
				.on(lentHistory.user.userId.eq(user.userId))
				.where(cabinetPlace.location.building
						.eq(building)
						.and(cabinetPlace.location.floor.eq(floor))
						.and(lentHistory.endedAt.isNull())
				)
				.fetch();
	}

}
