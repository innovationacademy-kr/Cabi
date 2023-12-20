package org.ftclub.cabinet.cabinet.newService;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CabinetQueryService {

    private final CabinetRepository cabinetRepository;

    public Cabinet getCabinet(Long cabinetId) {
        Optional<Cabinet> cabinet = cabinetRepository.findById(cabinetId);
        return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
    }

    public List<String> findAllBuildings() {
        log.debug("Called findAllBuildings");

    }
}
