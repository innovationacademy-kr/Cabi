package org.ftclub.cabinet.cabinet.service;

import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetDto;
import org.ftclub.cabinet.cabinet.domain.CabinetGrid;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetRepository;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.domain.MapArea;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CabinetService {

    final private CabinetRepository cabinetRepository;
    final private EntityManager entityManager;

    @Transactional
    public void saveMock() {
        CabinetPlace cabinetPlace = new CabinetPlace(new Location(), new CabinetGrid(),
                new MapArea());
        entityManager.persist(cabinetPlace);
        Cabinet cabinet1 = new Cabinet(1004, CabinetStatus.AVAILABLE, LentType.PRIVATE, 3,
                new Grid(), cabinetPlace);
        cabinetRepository.save(cabinet1);
    }

    @Transactional
    public CabinetDto getShareCabinet(Integer cabinetId) {
        Cabinet cabinet = cabinetRepository.findById((long) cabinetId)
                .orElseThrow(RuntimeException::new);
        ModelMapper modelMapper = new ModelMapper();
        //modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
        CabinetDto cabinetDto = modelMapper.map(cabinet, CabinetDto.class);
        return cabinetDto;
    }

}
