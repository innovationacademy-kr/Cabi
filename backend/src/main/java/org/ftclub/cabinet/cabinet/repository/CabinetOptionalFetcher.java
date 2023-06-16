package org.ftclub.cabinet.cabinet.repository;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CabinetOptionalFetcher {

	private final CabinetRepository cabinetRepository;

	public Cabinet getCabinetNullable(Long cabinetId) {
		return cabinetRepository.findById(cabinetId).orElse(null);
	}

	public Cabinet getCabinetNotNull(Long cabinetId) {
		return cabinetRepository.findById(cabinetId)
				.orElseThrow(() -> new DomainException(ExceptionStatus.NOT_FOUND_CABINET));
	}
}
