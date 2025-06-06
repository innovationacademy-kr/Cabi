package org.ftclub.cabinet.mapper;

import java.util.HashSet;
import java.util.Set;
import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.admin.dto.AdminPresentationUpdateServiceDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.dto.PresentationDetailDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateData;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PresentationMapper {

	/**
	 * 유저와 어드민이 수정 가능한 프레젠테이션의 필드 목록입니다.
	 */
	Set<String> USER_UPDATABLE_FIELDS = Set.of("summary", "outline", "detail", "publicAllowed");
	Set<String> ADMIN_UPDATABLE_FIELDS = Set.of(
			"title", "category", "duration",
			"summary", "outline", "detail",
			"publicAllowed", "recordingAllowed", "videoLink"
	);


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
	 * 유저의 수정 dto를 PresentationUpdateData로 변환합니다.
	 * <p>
	 * afterMapping에서 toUpdate 필드를 USER_UPDATABLE_FIELDS로 설정합니다.
	 * </p>
	 *
	 * @param updateDto 변환할 PresentationUpdateServiceDto
	 * @return 변환된 PresentationUpdateData
	 */
	PresentationUpdateData toPresentationUpdateData(PresentationUpdateServiceDto updateDto);

	@AfterMapping
	default void setToUpdateFields(
			PresentationUpdateServiceDto mappingDto,
			@MappingTarget PresentationUpdateData.PresentationUpdateDataBuilder dataBuilder) {
		dataBuilder.toUpdate(new HashSet<>(USER_UPDATABLE_FIELDS));
	}

	/**
	 * 어드민의 수정 dto를 PresentationUpdateData로 변환합니다.
	 * <p>
	 * afterMapping에서 toUpdate 필드를 ADMIN_UPDATABLE_FIELDS로 설정합니다.
	 * </p>
	 *
	 * @param updateDto 변환할 AdminPresentationUpdateServiceDto
	 * @return 변환된 PresentationUpdateData
	 */
	PresentationUpdateData toPresentationUpdateData(AdminPresentationUpdateServiceDto updateDto);

	@AfterMapping
	default void setToUpdateFields(
			AdminPresentationUpdateServiceDto mappingDto,
			@MappingTarget PresentationUpdateData.PresentationUpdateDataBuilder dataBuilder) {
		dataBuilder.toUpdate(new HashSet<>(ADMIN_UPDATABLE_FIELDS));
	}
}
