package org.ftclub.cabinet.cabinet.newService;

import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_STATUS;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.DomainException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CabinetCommandService {

	private final CabinetRepository cabinetRepository;

	public void changeStatus(Cabinet cabinet, CabinetStatus cabinetStatus) {
		cabinet.specifyStatus(cabinetStatus);
		cabinetRepository.save(cabinet);
	}

	public void changeUserCount(Cabinet cabinet, int userCount) {
		if (cabinet.isStatus(CabinetStatus.BROKEN)) {
			throw new DomainException(INVALID_STATUS);
		}
		if (userCount == 0) {
			cabinet.specifyStatus(CabinetStatus.PENDING);
			cabinet.writeMemo("");
			cabinet.writeTitle("");
		}
		if (userCount == cabinet.getMaxUser()) {
			cabinet.specifyStatus(CabinetStatus.FULL);
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
}
