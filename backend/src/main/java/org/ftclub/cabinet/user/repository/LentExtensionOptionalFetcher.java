package org.ftclub.cabinet.user.repository;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionOptionalFetcher {

    private final LentExtensionRepository lentExtensionRepository;

    /*-------------------------------------------FIND-------------------------------------------*/
    public Page<LentExtension> findAllLentExtension(PageRequest pageable) {
        return lentExtensionRepository.findAll(pageable);
    }

    public Page<LentExtension> findAllNotExpired(PageRequest pageable) {
        return lentExtensionRepository.findAllNotExpired(pageable);
    }

    public List<LentExtension> findLentExtensionByUserId(Long userId) {
        return lentExtensionRepository.findAllByUserId(userId);
    }

    public List<LentExtension> findLentExtensionNotExpiredByUserId(Long userId) {
        return lentExtensionRepository.findAllByUserIdNotExpired(userId);
    }


    /*-------------------------------------------GET--------------------------------------------*/
    public LentExtension getAvailableLentExtensionByUserId(Long userId) {
        log.debug("Called findLentExtensionByUserId: {}", userId);
        return lentExtensionRepository.findLentExtensionByUserIdAndUsedAtIsNull(userId).orElseThrow(
                () -> new ServiceException(ExceptionStatus.EXTENSION_TICKET_NOT_FOUND));
    }

}
