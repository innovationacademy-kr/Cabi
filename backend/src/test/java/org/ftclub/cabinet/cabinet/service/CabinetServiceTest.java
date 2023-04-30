package org.ftclub.cabinet.cabinet.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetGrid;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.domain.MapArea;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.CabinetDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
@ExtendWith(MockitoExtension.class)
class CabinetServiceTest {

    @Mock
    private CabinetRepository cabinetRepository;

    @InjectMocks
    private CabinetService cabinetService;

    @Test
    public void 캐비닛가져오기() {
        Cabinet cabinet = new Cabinet(1, CabinetStatus.AVAILABLE, LentType.PRIVATE,
                3, new Grid(), new CabinetPlace(new Location(), new CabinetGrid(), new MapArea()));

        when(cabinetRepository.findById(1L)).thenReturn(Optional.of(cabinet));

        CabinetDto target = cabinetService.getCabinetById(1L);
        assertThat(target.getCabinetId()).isEqualTo(1);
        assertThat(target.getStatus()).isEqualTo(CabinetStatus.AVAILABLE);
        assertThat(target.getLentType()).isEqualTo(LentType.PRIVATE);
    }

}
