package org.ftclub.cabinet.cabinet.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CabinetExceptionHandlerService {

    private final CabinetRepository cabinetRepository;

    public Cabinet getCabinet(Long cabinetId) {
        return cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
    }

}
