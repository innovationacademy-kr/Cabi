package org.ftclub.cabinet.cabinet.repository;

import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.dto.QActiveCabinetInfoEntities;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;

import static org.ftclub.cabinet.cabinet.domain.QCabinet.cabinet;
import static org.ftclub.cabinet.cabinet.domain.QCabinetPlace.cabinetPlace;
import static org.ftclub.cabinet.lent.domain.QLentHistory.lentHistory;
import static org.ftclub.cabinet.user.domain.QUser.user;

//@CacheConfig(cacheNames = "cabinets")
public class CabinetComplexRepositoryImpl implements CabinetComplexRepository {

	private final JPAQueryFactory queryFactory;

	public CabinetComplexRepositoryImpl(EntityManager em) {
		this.queryFactory = new JPAQueryFactory(em);
	}

	// CACHE
//	@Cacheable(key = "#building + #floor")
	public List<Cabinet> findAllCabinetsByBuildingAndFloor(String building, Integer floor) {
		JPAQuery<Cabinet> query = queryFactory.selectFrom(cabinet)
				.join(cabinetPlace)
				.on(cabinet.cabinetPlace.id.eq(cabinetPlace.id))
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
				.on(cabinet.cabinetPlace.id.eq(cabinetPlace.id))
				.join(lentHistory)
				.on(cabinet.id.eq(lentHistory.cabinet.id))
				.join(user)
				.on(lentHistory.user.id.eq(user.id))
				.where(cabinetPlace.location.building
						.eq(building)
						.and(cabinetPlace.location.floor.eq(floor))
						.and(lentHistory.endedAt.isNull())
				)
				.fetch();
	}

	@Override
	public List<Cabinet> findAllCabinetsByCabinetStatusAndBeforeEndedAt(CabinetStatus cabinetStatus,
	                                                                    LocalDateTime currentDate) {
		//LentHistory 에서, 오늘날짜 이전의 endedAt이면서, 중복되지 않는 레코드와 cabinet 을 join 해서 가져온다.
		//cabinetStatus 는 PENDING 이어야한다.
		return queryFactory.selectFrom(cabinet)
				.join(lentHistory)
				.on(cabinet.id.eq(lentHistory.cabinet.id))
				.where(cabinet.status.eq(cabinetStatus)
								.and(lentHistory.endedAt
												.before(currentDate)
//								.before(LocalDateTime.from(LocalDate.now().atStartOfDay()))
								)
				).fetch();
	}
}
