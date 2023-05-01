package org.ftclub.cabinet.cabinet.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CabinetServiceTest {

    @Mock
    private CabinetRepository cabinetRepository;

    @Autowired
    private CabinetService cabinetService;

    @Test
    public void 캐비닛가져오기() {
        Cabinet cabinet = mock(Cabinet.class);
        when(cabinet.cabinetId()).thenReturn(1L);
        when(cabinetRepository.findById(1L)).thenReturn(Optional.of(cabinet));

        assertThat(cabinetRepository.findById(1L).orElseThrow(RuntimeException::new)
                .cabinetId()).isEqualTo(1L);
//        assertThat(cabinetRepository.findById(1L).orElse(null)).isEqualTo(null);

//        CabinetDto target = cabinetService.getCabinetById(1L);
//        assertThat(target).isNull();
//        assertThat(target.getCabinetId()).isEqualTo(1);
//        assertThat(target.getStatus()).isEqualTo(CabinetStatus.AVAILABLE);
//        assertThat(target.getLentType()).isEqualTo(LentType.PRIVATE);
    }

}
