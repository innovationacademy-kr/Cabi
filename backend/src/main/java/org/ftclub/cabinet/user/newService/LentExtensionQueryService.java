package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensions;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionQueryService {

    private final LentExtensionRepository lentExtensionRepository;
    public LentExtension findActiveLentExtension(Long userId) {
        log.debug("Called getActiveLentExtension: {}", userId);

        return LentExtensions.builder()
                .lentExtensions(lentExtensionRepository.findAll(userId))
                .build()
                .findImminentActiveLentExtension();
    }

    public LentExtensions findActiveLentExtensions(Long userId) {
        log.debug("Called getLentExtensionList {}", userId);

        return LentExtensions.builder()
                .lentExtensions(lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId))
                .build();
    }

    public List<LentExtension> findLentExtensionsInLatestOrder(Long userId) {
        log.debug("Called getMyLentExtensionSorted: {}", userId);

        return lentExtensionRepository.findAll(userId)
                .stream()
                .sorted(Comparator.comparing(LentExtension::getExpiredAt, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }
}
