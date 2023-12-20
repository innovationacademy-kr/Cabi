package org.ftclub.cabinet.cabinet.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
public class CabinetFacadeService {
    private final CabinetQueryService cabinetQueryService;
    private final CabinetCommandService cabinetCommandService;

    /**
     * {@inheritDoc}
     * <p>
     * 존재하는 모든 건물들을 가져오고, 각 건물별 층 정보들을 가져옵니다.
     */
    @Transactional(readOnly = true)
    public List<BuildingFloorsDto> getBuildingFloorsResponse() {
        log.debug("getBuildingFloorsResponse");

    }


}
