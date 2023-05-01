package org.ftclub.cabinet.cabinet.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

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
