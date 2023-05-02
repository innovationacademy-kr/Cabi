package org.ftclub.cabinet.cabinet.service;

import java.util.ArrayList;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentRepository;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CabinetServiceImpl implements CabinetService {

    private final CabinetExceptionHandlerService cabinetExceptionHandlerService;
    private final CabinetRepository cabinetRepository;
    private final LentRepository lentRepository;
    private final UserRepository userRepository;
    private final CabinetMapper cabinetMapper;
    private final LentMapper lentMapper;

    @Override
    public CabinetDto getCabinetById(Long cabinetId) {
        Validate.notNull(cabinetId, "cabinetId must not not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        String title = cabinetRepository.findStatusNoteById(cabinetId);
        Location location = cabinetRepository.findLocationById(cabinetId);
        return cabinetMapper.toCabinetDto(title, location, cabinet);
    }

    @Override
    public BuildingFloorsResponseDto getBuildingFloors() {
        List<BuildingFloorsDto> buildingFloors = new ArrayList<>();
        List<String> buildings = cabinetRepository.findAllBuildings();
        for (String building : buildings) {
            System.out.printf("building: %s\n", building);
            List<Integer> floors = cabinetRepository.findAllFloorsByBuilding(building);
            buildingFloors.add(new BuildingFloorsDto(building, floors));
        }
        return new BuildingFloorsResponseDto(buildingFloors);
    }

    @Override
    public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        List<LentHistory> lentHistories = lentRepository.findAllActiveLentByCabinetId(cabinetId);
        List<LentDto> lents = new ArrayList<>();
        for (LentHistory lentHistory : lentHistories) {
            User user = userRepository.findById(lentHistory.getUserId())
                    .orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
            lents.add(lentMapper.toLentDto(user.name(), lentHistory));
        }
        return new CabinetInfoResponseDto(lents);
    }

    @Override
    public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
            Integer floor) {
        Validate.notNull(building, "building must not be null");
        Validate.notNull(floor, "floor must not be null");
        List<String> sections = cabinetRepository.findAllSectionsByBuildingAndFloor(building,
                floor);
        List<CabinetsPerSectionResponseDto> cabinetsPerSections = new ArrayList<>();
        for (String section : sections) {
            List<Long> cabinetIds = cabinetRepository.findAllCabinetIdsBySection(section);
            List<CabinetInfoResponseDto> cabinets = new ArrayList<>();
            for (Long cabinetId : cabinetIds) {
                cabinets.add(getCabinetInfo(cabinetId));
            }
            cabinetsPerSections.add(new CabinetsPerSectionResponseDto(section, cabinets));
        }
        return cabinetsPerSections;
    }

    @Override
    public void updateCabinetStatus(Long cabinetId, CabinetStatus status) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(status, "status must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.specifyStatus(status);
    }

    @Override
    public void updateCabinetStatusByUserCount(Long cabinetId, Integer userCount) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(userCount, "userCount must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        if (userCount > cabinet.getMaxUser()
                || cabinet.isStatus(CabinetStatus.BROKEN)) {
            throw new ServiceException(ExceptionStatus.UNCHANGEABLE_CABINET);
        }
        cabinet.updateStatusByUserCount(userCount);
    }
}
