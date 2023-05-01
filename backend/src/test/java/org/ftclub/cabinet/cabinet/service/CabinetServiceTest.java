package org.ftclub.cabinet.cabinet.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.junit.jupiter.api.Test;
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
<<<<<<< HEAD
    public void 캐비닛_상태_업데이트() {
        Cabinet cabinet = cabinetRepository.findById(1L).orElseThrow(RuntimeException::new);
        assertThat(cabinet.getStatus()).isEqualTo(CabinetStatus.BROKEN);
        cabinetService.updateCabinetStatus(1L, CabinetStatus.AVAILABLE);
        cabinet = cabinetRepository.findById(1L).orElseThrow(RuntimeException::new);
        assertThat(cabinet.getStatus()).isEqualTo(CabinetStatus.AVAILABLE);
        cabinetService.updateCabinetStatusByUserCount(1L, 1);
        cabinet = cabinetRepository.findById(1L).orElseThrow(RuntimeException::new);
        assertThat(cabinet.getStatus()).isEqualTo(CabinetStatus.FULL);
=======
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
>>>>>>> 165a57c3b02d5a0869792f88eb185d46de4725a2
    }

//    @Mock
//    private CabinetRepository cabinetRepository;
//
//    @InjectMocks
//    private CabinetService cabinetService;
//
//    @Test
//    public void 캐비닛가져오기() {
//        Cabinet cabinet = mock(Cabinet.class);
//        when(cabinet.cabinetId()).thenReturn(1L);
//        when(cabinetRepository.findById(1L)).thenReturn(Optional.of(cabinet));
//
//        assertThat(cabinetRepository.findById(1L).orElseThrow(RuntimeException::new)
//                .cabinetId()).isEqualTo(1L);
//        assertThat(cabinetRepository.findById(1L).orElse(null)).isEqualTo(null);
//
//        CabinetDto target = cabinetService.getCabinetById(1L);
//        assertThat(target).isNull();
//        assertThat(target.getCabinetId()).isEqualTo(1);
//        assertThat(target.getStatus()).isEqualTo(CabinetStatus.AVAILABLE);
//        assertThat(target.getLentType()).isEqualTo(LentType.PRIVATE);
//    }
}
