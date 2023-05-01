package org.ftclub.cabinet.cabinet.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetGrid;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.MapArea;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.CabinetDto;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
<<<<<<< HEAD
import org.springframework.transaction.annotation.Transactional;
=======
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
>>>>>>> 165a57c3b02d5a0869792f88eb185d46de4725a2

@SpringBootTest
@Transactional
class CabinetServiceTest {

    @Autowired
    private CabinetRepository cabinetRepository;

    @Autowired
    private CabinetService cabinetService;

    @Test
    public void 캐비닛_상태_업데이트() {
        Cabinet cabinet = cabinetRepository.findById(1L).orElseThrow(RuntimeException::new);
        assertThat(cabinet.getStatus()).isEqualTo(CabinetStatus.BROKEN);
        cabinetService.updateCabinetStatus(1L, CabinetStatus.AVAILABLE);
        cabinet = cabinetRepository.findById(1L).orElseThrow(RuntimeException::new);
        assertThat(cabinet.getStatus()).isEqualTo(CabinetStatus.AVAILABLE);
        cabinetService.updateCabinetStatusByUserCount(1L, 1);
        cabinet = cabinetRepository.findById(1L).orElseThrow(RuntimeException::new);
        assertThat(cabinet.getStatus()).isEqualTo(CabinetStatus.FULL);
    }
}
