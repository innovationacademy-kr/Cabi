package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.domain.PresentationUpdateData;
import org.ftclub.cabinet.presentation.dto.PresentationCardDto;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationLikeDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

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
	@Mapping(source = "presentation.id",           target = "presentationId")
	@Mapping(source = "presentation.user.name",   target = "userName")
	PresentationCardDto toPresentationCardDto(PresentationLike like);

	// Page<PresentationLike> → List<PresentationCardDto>
	List<PresentationCardDto> toPresentationCardDtoList(Page<PresentationLike> likes);


}
