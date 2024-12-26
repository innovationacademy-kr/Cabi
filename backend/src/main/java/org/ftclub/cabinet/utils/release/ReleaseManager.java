package org.ftclub.cabinet.utils.release;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetCommandService;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Log4j2
public class ReleaseManager {

	private final CabinetQueryService cabinetQueryService;
	private final CabinetCommandService cabinetCommandService;
	private final LentQueryService lentQueryService;

	private Set<Long> getAllPendedYesterdayCabinet() {
		LocalDateTime from = LocalDateTime.from(LocalDate.now().atStartOfDay());
		List<Cabinet> allPendingCabinets = cabinetQueryService.findAllPendingCabinets(
				CabinetStatus.PENDING);
		List<Long> cabinetIds = allPendingCabinets.stream()
				.map(Cabinet::getId).collect(Collectors.toList());
		Set<Long> todayReturnedSet = lentQueryService.findCabinetLentHistories(cabinetIds)
				.stream()
				.filter(lh -> lh.getEndedAt() != null && lh.getEndedAt().isAfter(from))
				.map(LentHistory::getCabinetId)
				.collect(Collectors.toSet());

		Set<Long> cabinetIdSet = new HashSet<>(cabinetIds);
		cabinetIdSet.removeAll(todayReturnedSet);
		return cabinetIdSet;
	}

	@Transactional
	public void releasingCabinets() {
		List<Long> cabinetIds = new ArrayList<>(getAllPendedYesterdayCabinet());
		if (cabinetIds.isEmpty()) {
			return;
		}
		cabinetCommandService.updateStatusBulk(cabinetIds, CabinetStatus.AVAILABLE);
	}
}
