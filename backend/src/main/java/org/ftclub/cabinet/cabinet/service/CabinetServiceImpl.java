package org.ftclub.cabinet.cabinet.service;

import java.util.ArrayList;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CabinetServiceImpl implements CabinetService {

	private final CabinetExceptionHandlerService cabinetExceptionHandlerService;
	private final LentRepository lentRepository;
	private final UserRepository userRepository;
	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;

	@Override
	public Cabinet getCabinet(Long cabinetId) {
		return cabinetExceptionHandlerService.getCabinet(cabinetId);
	}

	@Override
	public Location getLocationByCabinetId(Long cabinetId) {
		return cabinetExceptionHandlerService.getLocation(cabinetId);
	}

	@Override
	public List<String> getAllBuildings() {
		return cabinetExceptionHandlerService.getAllBuildings();
	}

	@Override
	public List<Integer> getAllFloorsByBuilding(String building) {
		return cabinetExceptionHandlerService.getAllFloorsByBuilding(building);
	}

	@Override
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
			Integer floor) {
		Validate.notNull(building, "building must not be null");
		Validate.notNull(floor, "floor must not be null");
		List<String> sections = cabinetExceptionHandlerService.getAllSectionsByBuildingAndFloor(
				building, floor);
		List<CabinetsPerSectionResponseDto> cabinetsPerSections = new ArrayList<>();
		for (String section : sections) {
			List<Long> cabinetIds = cabinetExceptionHandlerService.getAllCabinetIdsBySection(
					section);
			List<CabinetInfoResponseDto> cabinets = new ArrayList<>();
			for (Long cabinetId : cabinetIds) {
				cabinets.add(getCabinetInfo(cabinetId));
			}
			cabinetsPerSections.add(new CabinetsPerSectionResponseDto(section, cabinets));
		}
		return cabinetsPerSections;
	}

	@Override
	public void updateStatus(Long cabinetId, CabinetStatus status) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(status, "status must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.specifyStatus(status);
	}

	@Override
	public void updateStatusByUserCount(Long cabinetId, Integer userCount) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(userCount, "userCount must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		if (userCount > cabinet.getMaxUser()
				|| cabinet.isStatus(CabinetStatus.BROKEN)) {
			throw new ServiceException(ExceptionStatus.UNCHANGEABLE_CABINET);
		}
		cabinet.specifyStatusByUserCount(userCount);
	}

	@Override
	public void changeCabinetPlaceByLocation(Long cabinetId, Location location) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(location, "location must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		CabinetPlace cabinetPlace = cabinetExceptionHandlerService.getCabinetPlaceByLocation(
				location);
		cabinet.specifyCabinetPlace(cabinetPlace);
	}

	@Override
	public void updateMemo(Long cabinetId, String memo) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(memo, "memo must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.writeMemo(memo);
	}

	@Override
	public void updateVisibleNum(Long cabinetId, Integer visibleNum) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(visibleNum, "visibleNum must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.assignVisibleNum(visibleNum);
	}

	@Override
	public void updateTitle(Long cabinetId, String title) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(title, "title must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.writeTitle(title);
	}

	@Override
	public void updateLocation(Long cabinetId, Location location) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(location, "location must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
	}

	@Override
	public void updateMaxUser(Long cabinetId, Integer maxUser) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(maxUser, "maxUser must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.specifyMaxUser(maxUser);
	}

	@Override
	public void updateLentType(Long cabinetId, LentType lentType) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(lentType, "lentType must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.specifyLentType(lentType);
	}

	@Override
	public void updateGrid(Long cabinetId, Grid grid) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(grid, "grid must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.coordinateGrid(grid);
	}

	@Override
	public void updateStatusNote(Long cabinetId, String statusNote) {
		Validate.notNull(cabinetId, "cabinetId must not be null");
		Validate.notNull(statusNote, "statusNote must not be null");
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.writeStatusNote(statusNote);
	}
}
