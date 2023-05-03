package org.ftclub.cabinet.cabinet.service;

import static org.ftclub.cabinet.auth.AuthGuard.Level.USER_OR_ADMIN;

import java.util.ArrayList;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetFactory;
import org.ftclub.cabinet.cabinet.domain.CabinetPlaceFactory;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
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
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@AuthGuard(level = USER_OR_ADMIN)
public class CabinetServiceImpl implements CabinetService {

    private final CabinetExceptionHandlerService cabinetExceptionHandlerService;
    private final CabinetRepository cabinetRepository;
    private final LentRepository lentRepository;
    private final UserRepository userRepository;
    private final CabinetMapper cabinetMapper;
    private final LentMapper lentMapper;
    private final CabinetFactory cabinetFactory;
    private final CabinetPlaceFactory cabinetPlaceFactory;


    @Override
    public void createCabinet() {
        cabinetRepository.save(new Cabinet());
    }

    @Override
    public void createCabinetPlace() {
        cabinetRepository.save(new Cabinet());
    }

    @Override
    public void deleteCabinet() {
        cabinetRepository.save(new Cabinet());
    }

    @Override
    public void deleteCabinetPlace() {
        cabinetRepository.save(new Cabinet());
    }

    @Override
    public CabinetDto getCabinet(Long cabinetId) {
        Validate.notNull(cabinetId, "cabinetId must not not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        Location location = cabinetRepository.findLocationById(cabinetId);
        return cabinetMapper.toCabinetDto(cabinet.getTitle(), location, cabinet);
    }

    @Override
    public BuildingFloorsResponseDto getBuildingFloors() {
        List<BuildingFloorsDto> buildingFloors = new ArrayList<>();
        List<String> buildings = cabinetRepository.findAllBuildings();
        for (String building : buildings) {
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
        cabinet.updateStatusByUserCount(userCount);
    }

    @Override
    void changeCabinetPlaceByLocation(Long cabinetId, Location location) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(location, "location must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.changePlaceByLocation(location);
    }

    @Override
    void updateMemo(Long cabinetId, String memo) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(memo, "memo must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateMemo(memo);
    }

    @Override
    void updateVisibleNum(Long cabinetId, Integer visibleNum) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(visibleNum, "visibleNum must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateVisibleNum(visibleNum);
    }

    @Override
    void updateTitle(Long cabinetId, String title) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(title, "title must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateTitle(title);
    }

    @Override
    void updateLocation(Long cabinetId, Location location) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(location, "location must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateLocation(location);
    }

    @Override
    void updateMaxUser(Long cabinetId, Integer maxUser) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(maxUser, "maxUser must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateMaxUser(maxUser);
    }

    @Override
    void updateLentType(Long cabinetId, LentType lentType) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(lentType, "lentType must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateLentType(lentType);
    }

    @Override
    void updateGrid(Long cabinetId, Grid grid) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(grid, "grid must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateGrid(grid);
    }

    @Override
    void updateStatusNote(Long cabinetId, String statusNote) {
        Validate.notNull(cabinetId, "cabinetId must not be null");
        Validate.notNull(statusNote, "statusNote must not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        cabinet.updateStatusNote(statusNote);
    }
}
