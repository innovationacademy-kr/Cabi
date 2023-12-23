package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.UserSessionDto;
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
    public LentExtension getActiveLentExtension(UserSessionDto userSessionDto) {
        log.debug("Called getActiveLentExtension: {}", userSessionDto.getName());

        List<LentExtension> lentExtensions = lentExtensionRepository.findAll(userSessionDto.getUserId());
        return LentExtensions.builder()
                .lentExtensions(lentExtensions)
                .build()
                .findImminentActiveLentExtension();
    }

    public List<LentExtension> getMyLentExtensionInLatestOrder(Long userId) {
        log.debug("Called getMyLentExtensionSorted: {}", userId);

        return lentExtensionRepository.findAll(userId)
                .stream()
                .sorted(Comparator.comparing(LentExtension::getExpiredAt, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    public LentExtensions getActiveLentExtensionList(long userId) {
        log.debug("Called getLentExtensionList {}", userId);

        return LentExtensions.builder()
                .lentExtensions(lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId))
                .build();
    }
}
