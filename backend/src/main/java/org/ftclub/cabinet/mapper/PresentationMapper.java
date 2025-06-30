package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationMyListDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateData;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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
	@Mapping(target = "presentationStatus", source = "presentation.currentStatus")
	PresentationDetailDto toPresentationDetailDto(
			Presentation presentation,
			String thumbnailLink,
			Long likeCount,
			boolean likedByMe,
			boolean editAllowed
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

	/**
	 * Presentation 엔티티를 PresentationMyListDto로 변환합니다.
	 * <p>
	 * 상태에 대한 정보는 엔티티 내부에 선언된 getCurrentStatus 함수를 통해 계산합니다.
	 * </p>
	 *
	 * @param presentation 변환할 Presentation 엔티티
	 * @return 변환된 PresentationMyListDto
	 */
	@Mapping(target = "presentationId", source = "id")
	@Mapping(target = "presentationStatus", source = "currentStatus")
	PresentationMyListDto toPresentationMyListDto(Presentation presentation);

}
