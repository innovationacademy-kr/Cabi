package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.dto.PresentationFormData;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PresentationMapper {

	@Mapping(target = "userName", source = "userName")
	PresentationFormData toPresentationFormDataDto(Presentation presentation,
		String userName);

//	PresentationFormResponseDto toPresentationFormResponseDto(List<PresentationFormData> pastForms,
//		List<PresentationFormData> futureForms);

}
