package org.ftclub.cabinet.utils.release;

<<<<<<< HEAD
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

=======
>>>>>>> 3f3297013328376f063d03d50f9cf7b867f0926d
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Log4j2
public class ReleaseManager {

    private final CabinetOptionalFetcher cabinetOptionalFetcher;
    private final CabinetFacadeService cabinetFacadeService;

    private List<Cabinet> getAllPendedYesterdayCabinet() {
        return cabinetOptionalFetcher.findAllPendingCabinetsByCabinetStatusAndBeforeEndedAt(
                CabinetStatus.PENDING, LocalDateTime.from(LocalDate.now().atStartOfDay()));
    }

    private void releaseCabinets(List<Cabinet> cabinets) {
        for (Cabinet cabinet : cabinets) {
            releaseCabinet(cabinet);
        }
    }

<<<<<<< HEAD
	private void releaseCabinet(Cabinet cabinet) {
		cabinetService.updateStatus(cabinet.getId(), CabinetStatus.AVAILABLE);
	}
=======
    private void releaseCabinet(Cabinet cabinet) {
        cabinetFacadeService.updateStatus(cabinet.getCabinetId(), CabinetStatus.AVAILABLE);
    }
>>>>>>> 3f3297013328376f063d03d50f9cf7b867f0926d


    public void releasingCabinets() {
        List<Cabinet> cabinets = getAllPendedYesterdayCabinet();
        releaseCabinets(cabinets);
    }
}
