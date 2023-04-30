package org.ftclub.cabinet.cabinet.service;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CabinetServiceImpl implements CabinetService {

    private final CabinetMapper cabinetMapper;
    private final CabinetRepository cabinetRepository;
    //    private final LentRepository lentRepository;
    private final CabinetExceptionHandlerService cabinetExceptionHandlerService;

    @Override
    public CabinetDto getCabinetById(Long cabinetId) {
        Validate.notNull(cabinetId, "cabinetId must not not be null");
        Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
        return cabinetMapper.toCabinetDto(cabinet);
    }

    @Override
    public BuildingFloorsResponseDto getBuildingFloors() {
        List<BuildingFloorsDto> lists = new ArrayList<>();
        List<String> buildings = cabinetRepository.findAllBuildings();
        for (String building : buildings) {
            List<Integer> floors = cabinetRepository.findAllFloorsByBuilding(building);
            lists.add(new BuildingFloorsDto(building, floors));
        }
        return new BuildingFloorsResponseDto(lists);
    }

//    @Override
//    public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
//        //lentRepository needed
//    }
//
//    @Override
//    public CabinetsPerSectionResponseDto getCabinetsPerSection(Location location, Integer floor) {
//    }
}
