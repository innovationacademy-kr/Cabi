package org.ftclub.cabinet.cabinet.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.BrokenCabinetDto;
import org.ftclub.cabinet.dto.BrokenCabinetPaginationDto;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.utils.annotations.QueryService;

@QueryService
@RequiredArgsConstructor
public class CabinetQueryService {

	private final CabinetRepository cabinetRepository;

	//이거 쓰는 건가..?
	public BrokenCabinetDto getBrokenCabinetDto() {
//		return cabinetRepository.getBrokenCabinet();
		return null;
	}

	public BrokenCabinetPaginationDto getBrokenCabinetPaginationDto() {
//		return cabinetRepository.getBrokenCabinetPagination();
		return null;
	}

	public BuildingFloorsDto getBuildingFloorsDto() {
//		return cabinetRepository.getBuildingFloors();
		return null;
	}

	public CabinetDto getCabinetDtoById(Long cabinetId) {
//		return cabinetRepository.getCabinet(cabinetId);
		return null;
	}

	public CabinetPaginationDto getCabinetPaginationDto() {
//		return cabinetRepository.getCabinetPagination();
		return null;
	}

	//2차 DTO - User?
//	public MyCabinetResponseDto getMyCabinetResponseDto() {
//		return cabinetRepository.getMyCabinet();
//	}

	//2차 DTO
//	public CabinetsPerSectionResponseDto getCabinetsPerSectionResponseDto() {
//		return cabinetRepository.getCabinetsPerSection();
//	}

	// Lent가 해야할 것 같은 DTO
//	public CabinetFloorStatisticsResponseDto getCabinetFloorStatisticsResponseDto() {
//		return cabinetRepository.getCabinetFloorStatistics();
//	}

	// 2차 DTO
//	public CabinetInfoResponseDto getCabinetInfoResponseDtoById(Long cabinetId) {
//		return cabinetRepository.getCabinetInfo(cabinetId);
//	}

	//2차 DTO
//	public CabinetInfoPaginationDto getCabinetInfoPaginationDto() {
//		return cabinetRepository.getCabinetInfoPagination();
//	}

}
