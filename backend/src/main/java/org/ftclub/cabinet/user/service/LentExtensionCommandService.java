package org.ftclub.cabinet.user.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionPolicy;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentExtensionCommandService {

    private final LentExtensionRepository lentExtensionRepository;

    private final LentExtensionPolicy policy;
    private final CabinetProperties cabinetProperties;

    public LentExtension createLentExtension(Long userId, LentExtensionType type, LocalDateTime expiredAt) {
        LentExtension lentExtension = LentExtension.of(policy.getDefaultName(),
                policy.getDefaultExtensionTerm(),
                policy.getExpiry(expiredAt),
                type, userId);
        return lentExtensionRepository.save(lentExtension);
    }

    public void useLentExtension(LentExtension lentExtension, List<LentHistory> lentHistories) {
        lentExtension.use();
        lentHistories.forEach(lentHistory ->
                lentHistory.setExpiredAt(
                        lentHistory.getExpiredAt().plusDays(lentExtension.getExtensionPeriod())));
    }
}
