package org.ftclub.cabinet.presentation.repository;

import static org.ftclub.cabinet.presentation.domain.QPresentation.presentation;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import javax.persistence.EntityManager;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class PresentationComplexRepositoryImpl implements PresentationComplexRepository {

	private final JPAQueryFactory queryFactory;

	public PresentationComplexRepositoryImpl(EntityManager em) {
		this.queryFactory = new JPAQueryFactory(em);
	}

	/**
	 * 조건에 따라 동적으로 발표 목록을 페이징하여 조회합니다.
	 *
	 * @param category   카테고리 필터
	 * @param sort       정렬 기준
	 * @param pageable   페이징 정보
	 * @param publicOnly 공개된 발표만 조회할지 여부
	 * @return 발표 정보 페이지
	 */
	@Override
	public Page<Presentation> findPresentations(Category category, String sort, Pageable pageable,
			boolean publicOnly) {
		// 데이터 조회를 위한 기본 쿼리
		JPAQuery<Presentation> query = queryFactory
				.selectFrom(presentation)
				.leftJoin(presentation.user).fetchJoin();  // 발표 작성자 이름도 함께 조회

		query.where(presentation.canceled.isFalse());

		// 동적 WHERE 절: 카테고리
		if (category != null && category != Category.ALL) {
			query.where(presentation.category.eq(category));
		}

		// 동적 WHERE 절: 공개 여부 (익명 사용자용)
		if (publicOnly) {
			query.where(presentation.publicAllowed.isTrue());
		}

		// 동적 ORDER BY 절
		OrderSpecifier<?> orderSpecifier = "LIKE".equalsIgnoreCase(sort)
				? presentation.presentationLikes.size().desc() // '좋아요' 많은 순
				: presentation.startTime.desc(); // 기본은 '최신' 순

		query.orderBy(orderSpecifier);

		// 페이징 적용하여 데이터 조회
		List<Presentation> content = query.offset(pageable.getOffset())
				.limit(pageable.getPageSize())
				.fetch();

		// 전체 카운트 조회를 위한 쿼리 (페이징 정보에 필요)
		JPAQuery<Long> countQuery = queryFactory
				.select(presentation.count())
				.from(presentation);

		countQuery.where(presentation.canceled.isFalse());

		// 카운트 쿼리에도 동일한 WHERE 조건 적용
		if (category != null && category != Category.ALL) {
			countQuery.where(presentation.category.eq(category));
		}
		if (publicOnly) {
			countQuery.where(presentation.publicAllowed.isTrue());
		}
		Long totalCount = countQuery.fetchOne();

		return new PageImpl<>(content, pageable, totalCount != null ? totalCount : 0L);
	}
}
