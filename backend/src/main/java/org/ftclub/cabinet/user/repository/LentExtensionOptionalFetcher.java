package org.ftclub.cabinet.user.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionOptionalFetcher {

    private final LentExtensionRepository lentExtensionRepository;

    /*-------------------------------------------FIND-------------------------------------------*/
    /*-------------------------------------------GET--------------------------------------------*/
    public LentExtension getAvailableLentExtensionByUserId(Long userId) {
        log.debug("Called findLentExtensionByUserId: {}", userId);
        return lentExtensionRepository.findLentExtensionByUserIdAndUsedAtIsNull(userId).orElseThrow(
                () -> new ServiceException(ExceptionStatus.EXTENSION_TICKET_NOT_FOUND));
    }

}
