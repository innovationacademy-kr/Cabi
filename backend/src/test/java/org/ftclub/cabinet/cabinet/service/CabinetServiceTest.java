package org.ftclub.cabinet.cabinet.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;
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
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class CabinetServiceTest {

    @Mock
    private CabinetRepository cabinetRepository;

    @InjectMocks
    private CabinetService myService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testQuery() {
        int count = jdbcTemplate.queryForObject("select count(*) from cabinet", Integer.class);
        assertThat(count).isEqualTo(28);
    }

    @Test
    public void testFindAll() {
        Cabinet cabinet = new Cabinet(1, CabinetStatus.AVAILABLE, LentType.PUBLIC, 3, new Grid(),
                new CabinetPlace(new Location(), new CabinetGrid(), new MapArea()));

        // Add expected entities to the list...

        when(cabinetRepository.findById(1L)).thenReturn(Optional.of(cabinet));

        CabinetDto cabinetDto = myService.getShareCabinet(1);
        ModelMapper modelMapper = new ModelMapper();
        //modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
        CabinetDto test = modelMapper.map(cabinet, CabinetDto.class);
        assertThat(cabinetDto.getCabinetId()).isEqualTo(1);
    }

}
