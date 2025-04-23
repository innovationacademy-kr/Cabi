package org.ftclub.cabinet.mapper;

import java.util.List;
import org.ftclub.cabinet.dto.PresentationFormData;
import org.ftclub.cabinet.dto.PresentationMainData;
import org.ftclub.cabinet.dto.PresentationMyPageDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PresentationMapper {

	@Mapping(target = "userName", source = "user.name")
	PresentationFormData toPresentationFormDataDto(Presentation presentation);


	PresentationMyPageDto toPresentationMyPageDto(Presentation presentation);

	PresentationMainData toPresentationMainData(List<PresentationFormData> past,
			List<PresentationFormData> upcoming);
}
