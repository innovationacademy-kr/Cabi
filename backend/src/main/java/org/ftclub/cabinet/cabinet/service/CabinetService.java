package org.ftclub.cabinet.cabinet.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

@Service
@RequiredArgsConstructor
public class CabinetService {
    final private CabinetRepository cabinetRepository;
    final private EntityManager entityManager;
    @Transactional
    public void saveMock() {
        CabinetPlace cabinetPlace = new CabinetPlace(new Location(), new CabinetGrid(), new MapArea());
        entityManager.persist(cabinetPlace);
        Cabinet cabinet1 = new Cabinet(1004, CabinetStatus.AVAILABLE, LentType.PUBLIC, 3, new Grid(), cabinetPlace);
        cabinetRepository.save(cabinet1);
    }
    @Transactional
    public CabinetDto getShareCabinet(Integer cabinetId) {
        Cabinet cabinet = cabinetRepository.findById((long) cabinetId).orElseThrow(RuntimeException::new);
        ModelMapper modelMapper = new ModelMapper();
        //modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
        CabinetDto cabinetDto = modelMapper.map(cabinet, CabinetDto.class);
        return cabinetDto;
    }

}
