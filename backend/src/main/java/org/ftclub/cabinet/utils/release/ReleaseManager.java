package org.ftclub.cabinet.utils.release;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class ReleaseManager {

	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final CabinetService cabinetService;

	private List<Cabinet> getAllPendedYesterdayCabinet() {
		return cabinetOptionalFetcher.findAllPendingCabinetsByCabinetStatusAndBeforeEndedAt(
				CabinetStatus.PENDING, LocalDateTime.from(
						LocalDate.now().atStartOfDay()));
	}

	private void releaseCabinets(List<Cabinet> cabinets) {
		for (Cabinet cabinet : cabinets) {
			releaseCabinet(cabinet);
		}
	}

	private void releaseCabinet(Cabinet cabinet) {
		cabinetService.updateStatus(cabinet.getCabinetId(), CabinetStatus.AVAILABLE);
	}


	public void releasingCabinets() {
		List<Cabinet> cabinets = getAllPendedYesterdayCabinet();
		releaseCabinets(cabinets);
	}
}
