package org.ftclub.cabinet.admin.presentation.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.service.PresentationQueryService;
import org.ftclub.cabinet.presentation.service.ThumbnailStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminPresentationFacadeService {

	private final PresentationQueryService queryService;
	private final ThumbnailStorageService thumbnailStorageService;
	private final PresentationMapper presentationMapper;

	/**
	 * 일정 관리(달력)에서 해당 연월의 프레젠테이션 목록을 조회합니다.
	 *
	 * @param yearMonth yyyy-MM 형식의 연월
	 * @return 프레젠테이션 목록
	 */
	@Transactional(readOnly = true)
	public List<AdminPresentationCalendarItemDto> getPresentationByDate(YearMonth yearMonth) {
		// 연월에 해당하는 모든 프레젠테이션 목록을 조회(취소 포함)
		List<Presentation> presentations = queryService.findPresentationsByYearMonth(
				yearMonth);

		return presentations.stream()
				.map(presentationMapper::toAdminPresentationCalendarItemDto)
				.collect(Collectors.toList());
	}

	/**
	 * 프레젠테이션 상세 정보를 조회합니다.
	 *
	 * @param presentationId 프레젠테이션 ID
	 */
	@Transactional(readOnly = true)
	public PresentationDetailDto getPresentationDetail(Long presentationId) {
		Presentation presentation = queryService.getPresentationByIdWithUser(presentationId);
		String thumbnailLink = thumbnailStorageService.generatePresignedUrl(
				presentation.getThumbnailS3Key());
		Long likesCount = 0L;   // likeQueryService.getLikesCount(presentationId);    // TODO: likeQueryService
		boolean upcoming = presentation.getStartTime().isAfter(LocalDateTime.now());

		return presentationMapper.toPresentationDetailDto(
				presentation,
				thumbnailLink,
				likesCount,
				false,
				false,
				upcoming
		);
	}
}
