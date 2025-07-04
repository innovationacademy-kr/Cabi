package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.domain.PresentationUpdateData;
import org.ftclub.cabinet.presentation.dto.PresentationCardDto;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationLikeDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PresentationMapper {

	/**
	 * Presentation 엔티티를 AdminPresentationCalendarItemDto로 변환합니다.
	 *
	 * @param presentation 변환할 Presentation 엔티티
	 * @return 변환된 AdminPresentationCalendarItemDto
	 */
	@Mapping(target = "presentationId", source = "id")
	@Mapping(target = "slotId", source = "slot.id")
	AdminPresentationCalendarItemDto toAdminPresentationCalendarItemDto(Presentation presentation);

	/**
	 * Presentation 엔티티를 PresentationDetailDto로 변환합니다.
	 *
	 * @param presentation 변환할 Presentation 엔티티
	 * @return 변환된 PresentationDetailDto
	 */
	@Mapping(target = "userName", source = "presentation.user.name")
	PresentationDetailDto toPresentationDetailDto(
			Presentation presentation,
			String thumbnailLink,
			Long likeCount,
			boolean likedByMe,
			boolean editAllowed,
			boolean upcoming
	);

	/**
	 * 검증이 완료된 수정 dto를 PresentationUpdateData로 변환합니다.
	 *
	 * @param updateDto 변환할 PresentationUpdateServiceDto
	 * @return 변환된 PresentationUpdateData
	 */
	PresentationUpdateData toPresentationUpdateData(
			PresentationUpdateServiceDto updateDto,
			String thumbnailS3Key);

//	@Mapping(target = "presentationId", source = "presentation.id")
//	PresentationCardDto toPresentationCardDto(
//			Presentation presentation,
//			String thumbnailS3Key,
//			Long likeCount,
//			boolean likedByMe,
//			String userName
//	);

	// PresentationLike → PresentationCardDto 변환
	@Mapping(source = "presentation.id",                   target = "presentationId")
	@Mapping(source = "presentation.startTime",            target = "startTime")
	@Mapping(source = "presentation.presentationLocation", target = "presentationLocation")
	@Mapping(source = "presentation.title",                target = "title")
	@Mapping(source = "presentation.summary",              target = "summary")
	@Mapping(source = "presentation.category",             target = "category")
	@Mapping(source = "presentation.thumbnailS3Key",       target = "thumbnailS3Key")
	// 전체 소스 객체를 mapStatus()에 넘겨서 presentationStatus를 채워준다
	@Mapping(target = "presentationStatus", source = ".")
	@Mapping(source = "presentation.user.name",            target = "userName")
	PresentationCardDto toPresentationCardDto(PresentationLike like);

	/** startTime 기준으로 상태를 계산하는 커스텀 매핑 메서드 */
	default PresentationStatus mapStatus(PresentationLike like) {
		LocalDateTime now = LocalDateTime.now();
		return like.getPresentation().getStartTime().isAfter(now)
				? PresentationStatus.EXPECTED
				: PresentationStatus.DONE;
	}
	//TODO : CANCEL은 애초에 검색이 안돼서 예외처리 하지 않아도 되는지 확인하기.

	// Page<PresentationLike> → List<PresentationCardDto>
	List<PresentationCardDto> toPresentationCardDtoList(Page<PresentationLike> likes);


}
