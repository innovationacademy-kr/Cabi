package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.LentExtensionResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensions;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionQueryService {

    private final LentExtensionRepository lentExtensionRepository;
    public LentExtension getActiveLentExtension(UserSessionDto userSessionDto) {
        log.debug("Called getActiveLentExtension: {}", userSessionDto.getName());

        List<LentExtension> lentExtensions = lentExtensionRepository.findAllByUserId(userSessionDto.getUserId());
        return LentExtensions.builder()
                .lentExtensions(lentExtensions)
                .build()
                .findImminentActiveLentExtension();
    }
}
