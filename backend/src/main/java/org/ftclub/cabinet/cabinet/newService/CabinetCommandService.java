package org.ftclub.cabinet.cabinet.newService;

import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.BROKEN;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.FULL;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.PENDING;
import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_STATUS;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.utils.ExceptionUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class CabinetCommandService {

	private final CabinetRepository cabinetRepository;

	public void changeStatus(Cabinet cabinet, CabinetStatus cabinetStatus) {
		cabinet.specifyStatus(cabinetStatus);
		cabinetRepository.save(cabinet);
	}

	public void changeUserCount(Cabinet cabinet, int userCount) {
		if (cabinet.isStatus(BROKEN)) {
			throw new DomainException(INVALID_STATUS);
		}
		if (userCount == 0) {
			cabinet.specifyStatus(CabinetStatus.PENDING);
			cabinet.writeMemo("");
			cabinet.writeTitle("");
		}
		if (userCount == cabinet.getMaxUser()) {
			cabinet.specifyStatus(FULL);
		}
		cabinetRepository.save(cabinet);
	}

	public void updateTitle(Cabinet cabinet, String title) {
		cabinet.writeTitle(title);
		cabinetRepository.save(cabinet);
	}

	public void updateMemo(Cabinet cabinet, String memo) {
		cabinet.writeMemo(memo);
		cabinetRepository.save(cabinet);
	}

	public void changeUserCount(List<Cabinet> cabinets, int userCount) {
		cabinets.forEach(cabinet -> ExceptionUtil.throwIfFalse(!cabinet.isStatus(BROKEN),
				new DomainException(INVALID_STATUS)));
		List<Long> cabinetIds = cabinets.stream()
				.map(Cabinet::getCabinetId).collect(Collectors.toList());
		if (userCount == 0) {
			cabinetRepository.updateStatusAndClearTitleAndMemoByCabinetIdsIn(cabinetIds, PENDING);
		} else {
			cabinetRepository.updateStatusByCabinetIdsIn(cabinetIds, FULL);
		}
	}

	public void changeCabinetStatusNote(Cabinet cabinet, String changedStatusNote) {
		cabinet.writeStatusNote(changedStatusNote);
	}

	public void updateGrid(Cabinet cabinet, Grid modifedGrid) {
		cabinet.coordinateGrid(modifedGrid);
	}

	public void updateVisibleNum(Cabinet cabinet, Integer visibleNum) {
		cabinet.assignVisibleNum(visibleNum);
	}

	public void updateStatus(Cabinet cabinet, CabinetStatus status) {
		cabinet.specifyStatus(status);
	}

	public void updateLentType(Cabinet cabinet, LentType lentType) {
		cabinet.specifyLentType(lentType);
	}

	public void updateClubStatus(Cabinet cabinet, String clubName, String statusNote) {
		cabinet.writeTitle(clubName);
		cabinet.writeStatusNote(statusNote);
		cabinet.specifyLentType(LentType.CLUB);
	}
}
