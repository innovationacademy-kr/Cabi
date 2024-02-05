package org.ftclub.cabinet.utils.release;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class ReleaseManager {

	private final CabinetQueryService cabinetQueryService;
	private final CabinetFacadeService cabinetFacadeService;

	private List<Cabinet> getAllPendedYesterdayCabinet() {
		return cabinetQueryService.findAllPendingCabinetsByCabinetStatusAndBeforeEndedAt(
				CabinetStatus.PENDING, LocalDateTime.from(LocalDate.now().atStartOfDay()));
	}

	public void releasingCabinets() {
		List<Cabinet> cabinets = getAllPendedYesterdayCabinet();
		List<Long> cabinetIds = cabinets.stream().map(Cabinet::getId).collect(Collectors.toList());
		cabinetFacadeService.updateStatus(cabinetIds, CabinetStatus.AVAILABLE);
	}
}
