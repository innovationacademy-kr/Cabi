package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PresentationMapper {

	/**
	 * Presentation 엔티티를 AdminPresentationResponseDto로 변환합니다.
	 *
	 * @param presentation 변환할 Presentation 엔티티
	 * @return 변환된 AdminPresentationResponseDto
	 */
	@Mapping(target = "presentationId", source = "id")
	@Mapping(target = "location", source = "presentationLocation")
	@Mapping(target = "slotId", source = "slot.id")
	AdminPresentationCalendarItemDto toAdminPresentationCalendarItemDto(Presentation presentation);
}
