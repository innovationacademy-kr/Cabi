package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.ActiveCabinetInfoDto;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetSimpleDto;
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

	@Mapping(target = "cabinetId", source = "lentHistory.cabinetId")
	@Mapping(target = "userId", source = "lentHistory.userId")
	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	ActiveCabinetInfoDto toActiveCabinetInfoDto(Cabinet cabinet, LentHistory lentHistory,
			User user);

	@Mapping(target = "cabinet", source = "cabinet")
	@Mapping(target = "lentHistory", source = "lentHistory")
	@Mapping(target = "user", source = "user")
	ActiveCabinetInfoEntities toActiveCabinetInfoEntitiesDto(Cabinet cabinet,
			LentHistory lentHistory, User user);

	/*--------------------------------Wrapped DTO--------------------------------*/

	//TO do : cabinetPlace러 바꾸기
	CabinetsPerSectionResponseDto toCabinetsPerSectionResponseDto(String section,
			List<CabinetPreviewDto> cabinets);

	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	CabinetInfoResponseDto toCabinetInfoResponseDto(Cabinet cabinet, List<LentDto> lents,
			LocalDateTime sessionExpiredAt);

	@Mapping(target = "totalLength", source = "totalLength")
	CabinetPaginationDto toCabinetPaginationDtoList(List<CabinetDto> result,
			Long totalLength);

	OverdueUserCabinetPaginationDto toOverdueUserCabinetPaginationDto(
			List<OverdueUserCabinetDto> result, Long totalLength);

	UserCabinetPaginationDto toUserCabinetPaginationDto(List<UserCabinetDto> result,
			Long totalLength);

	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	@Mapping(target = "shareCode", source = "sessionShareCode")
	@Mapping(target = "sessionExpiredAt", source = "sessionExpiredAt")
	MyCabinetResponseDto toMyCabinetResponseDto(Cabinet cabinet, List<LentDto> lents,
			String sessionShareCode, LocalDateTime sessionExpiredAt, String previousUserName);

	CabinetPreviewDto toCabinetPreviewDto(Cabinet cabinet, Integer userCount, String name);

	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	CabinetSimpleDto toCabinetSimpleDto(Cabinet cabinet);

}
