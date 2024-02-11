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
import org.ftclub.cabinet.cqrs.manager.CqrsManager;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class ReleaseManager {

	private final CabinetQueryService cabinetQueryService;
	private final CabinetFacadeService cabinetFacadeService;

	private final CqrsManager cqrsManager;


	public void releasingCabinets() {
		LocalDateTime startOfToday = LocalDateTime.from(LocalDate.now().atStartOfDay());
		List<Cabinet> cabinets = cabinetQueryService.findAllPendingCabinets(startOfToday);
		List<Long> cabinetIds = cabinets.stream().map(Cabinet::getId).collect(Collectors.toList());
		cabinetFacadeService.updateStatus(cabinetIds, CabinetStatus.AVAILABLE);

		// Bulk update 이후 상태 변경하므로 엔티티를 바꾸더라도 변경 감지에 의해 update 쿼리 발생하지 않음
		cabinets.forEach(cabinet -> {
			cabinet.specifyStatus(CabinetStatus.AVAILABLE);
			cqrsManager.changeCabinet(cabinet);
		});
	}
}
