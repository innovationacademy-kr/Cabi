package org.ftclub.cabinet.user.repository;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionOptionalFetcher {

    private final LentExtensionRepository lentExtensionRepository;

    /*-------------------------------------------FIND-------------------------------------------*/
    @Transactional(readOnly = true)
    public Page<LentExtension> findAllLentExtension(PageRequest pageable) {
        return lentExtensionRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<LentExtension> findAllNotExpired(PageRequest pageable) {
        return lentExtensionRepository.findAllNotExpired(pageable);
    }

    @Transactional(readOnly = true)
    public List<LentExtension> findLentExtensionByUserId(Long userId) {
        return lentExtensionRepository.findAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public LentExtension findActiveLentExtensionByUserId(Long userId) {
        return lentExtensionRepository.findByUserIdAndUsedAtIsNull(userId).orElse(null);
    }
}
