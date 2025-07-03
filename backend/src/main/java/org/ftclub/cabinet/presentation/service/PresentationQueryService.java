package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PresentationQueryService {
	private final PresentationRepository presentationRepository;

	/**
	 * 주어진 기간 안에 등록되어 있는 프레젠테이션을 시간순으로 조회합니다.
	 *
	 * @param yearMonth yyyy-MM 형식의 연월
	 * @return 프레젠테이션 리스트
	 */
	public List<Presentation> findPresentationsByYearMonth(YearMonth yearMonth) {
		LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
		LocalDateTime endDate = startDate.plusMonths(1);
		return presentationRepository.findAllWithinPeriod(startDate, endDate);
	}

	/**
	 * presentationId로 프레젠테이션을 조회합니다. (no join)
	 *
	 * @param presentationId 프레젠테이션 ID
	 * @return 프레젠테이션
	 */
	public Presentation findPresentationById(Long presentationId) {
		return presentationRepository.findById(presentationId)
				.orElseThrow(ExceptionStatus.PRESENTATION_NOT_FOUND::asServiceException);
	}

	/**
	 * presetnationId로 프레젠테이션을 조회합니다.
	 * <p>
	 * User도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param presentationId 프레젠테이션 ID
	 * @return 프레젠테이션
	 */
	public Presentation findPresentationByIdWithUser(Long presentationId) {
		return presentationRepository.findByIdJoinUser(presentationId)
				.orElseThrow(ExceptionStatus.PRESENTATION_NOT_FOUND::asServiceException);
	}
}
