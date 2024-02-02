package org.ftclub.cabinet.cqrs.service;

import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.CABINET_PER_SECTION;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.PENDING_CABINET;

import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cqrs.respository.CqrsRedis;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.springframework.stereotype.Service;

@Service
@Logging(level = LogLevel.DEBUG)
@RequiredArgsConstructor
public class CqrsService {

	private final CqrsRedis cqrsRedis;

	private final CabinetMapper cabinetMapper;


	public void clearPendingCabinet() {
		cqrsRedis.clearBySuffix(PENDING_CABINET);
	}

	public void clearCabinetPerSection() {
		cqrsRedis.clearBySuffix(CABINET_PER_SECTION);
	}

	public void addPendingCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String floor = location.getFloor().toString();
		List<CabinetPreviewDto> pendingCabinets = cqrsRedis.getPendingCabinets(floor);
		pendingCabinets.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
		pendingCabinets.sort(Comparator.comparing(CabinetPreviewDto::getVisibleNum));
		cqrsRedis.setPendingCabinet(floor, pendingCabinets);
	}

	public void removePendingCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String floor = location.getFloor().toString();
		List<CabinetPreviewDto> pendingCabinets = cqrsRedis.getPendingCabinets(floor);
		pendingCabinets.removeIf(c -> c.getCabinetId().equals(cabinet.getId()));
		cqrsRedis.setPendingCabinet(floor, pendingCabinets);
	}
}
