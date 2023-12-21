package org.ftclub.cabinet.cabinet.newService;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CabinetQueryService {

	private final CabinetRepository cabinetRepository;

	public Cabinet getCabinet(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findById(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet getCabinetWithLock(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findByIdWithLock(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<Cabinet> getCabinetWithLock(List<Long> cabinetIds) {
		return cabinetRepository.findAllByIdsWithLock(cabinetIds);
	}

	public Cabinet getUserActiveCabinetWithLock(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNullWithLock(userId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet findUserActiveCabinet(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNull(userId);
		return cabinet.orElse(null);
	}

//	public List<String> findAllBuildings() {
//		log.debug("Called findAllBuildings");
//
//	}
}
