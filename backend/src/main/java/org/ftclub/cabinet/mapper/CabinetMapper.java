package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.dto.UserCabinetDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

//@NullableMapper
@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_DEFAULT,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Component
public interface CabinetMapper {

	CabinetMapper INSTANCE = Mappers.getMapper(CabinetMapper.class);

	/*------------------------------------DTO------------------------------------*/

	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	CabinetDto toCabinetDto(Cabinet cabinet);

	@Mapping(target = "cabinetId", source = "lentHistory.cabinetId")
	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	OverdueUserCabinetDto toOverdueUserCabinetDto(LentHistory lentHistory, User user,
			Cabinet cabinet, Long overdueDays);

	UserCabinetDto toUserCabinetDto(UserBlockedInfoDto userInfo, CabinetDto cabinetInfo);

	//To do : CabinetPlace로 바꾸기?
	BuildingFloorsDto toBuildingFloorsDto(String building, List<Integer> floors);


	/*--------------------------------Wrapped DTO--------------------------------*/

	//TO do : cabinetPlace러 바꾸기
	CabinetsPerSectionResponseDto toCabinetsPerSectionResponseDto(String section,
			List<CabinetPreviewDto> cabinets);

	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	CabinetInfoResponseDto toCabinetInfoResponseDto(Cabinet cabinet, List<LentDto> lents);

	@Mapping(target = "totalPage", source = "totalPage")
	CabinetPaginationDto toCabinetPaginationDtoList(List<CabinetDto> result,
			Integer totalPage);

	OverdueUserCabinetPaginationDto toOverdueUserCabinetPaginationDto(
			List<OverdueUserCabinetDto> result, Integer totalLength);

	UserCabinetPaginationDto toUserCabinetPaginationDto(List<UserCabinetDto> result,
			Long totalLength);

	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	MyCabinetResponseDto toMyCabinetResponseDto(Cabinet cabinet, List<LentDto> lents);

	CabinetPreviewDto toCabinetPreviewDto(Cabinet cabinet, Integer userCount, String name);
}
