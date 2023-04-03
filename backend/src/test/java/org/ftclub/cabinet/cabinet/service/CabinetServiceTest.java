package org.ftclub.cabinet.cabinet.service;

import org.ftclub.cabinet.cabinet.domain.*;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
class CabinetServiceTest {
    @Mock
    private CabinetRepository cabinetRepository;

    @InjectMocks
    private CabinetService myService;

    @Test
    public void testFindAll() {
        Cabinet cabinet = new Cabinet(1, CabinetStatus.AVAILABLE, LentType.PUBLIC, 3, new Grid(), new CabinetPlace(new Location(), new CabinetGrid(), new MapArea()));
        // Add expected entities to the list...

        when(cabinetRepository.findById(1L)).thenReturn(Optional.of(cabinet));

        CabinetDto cabinetDto = myService.getShareCabinet(1);
        ModelMapper modelMapper = new ModelMapper();
        //modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
        CabinetDto test = modelMapper.map(cabinet, CabinetDto.class);
        assertThat(cabinetDto.getCabinetId()).isEqualTo(1);
    }

}