package org.ftclub.cabinet.presentation.repository;

import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.utils.annotations.ComplexRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@ComplexRepository(entityClass = {Presentation.class, PresentationLike.class, User.class})
public interface PresentationComplexRepository {

	/**
	 * 조건에 따라 동적으로 발표 목록을 페이징하여 조회합니다.
	 *
	 * @param category   카테고리 필터
	 * @param sort       정렬 기준
	 * @param pageable   페이징 정보
	 * @param publicOnly 공개된 발표만 조회할지 여부
	 * @return 발표 정보 페이지
	 */
	public Page<Presentation> findPresentations(Category category, String sort, Pageable pageable,
			boolean publicOnly);
}
