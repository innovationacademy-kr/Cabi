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

    /**
     * 연장권을 생성합니다.
     *
     * @param userId   유저 ID
     * @param type     연장권 타입
     * @param expiredAt 만료일
     * @return 생성된 연장권
     */
    public LentExtension createLentExtension(Long userId, LentExtensionType type, LocalDateTime expiredAt) {
        LentExtension lentExtension = LentExtension.of(policy.getDefaultName(),
                policy.getDefaultExtensionTerm(),
                policy.getExpiry(expiredAt),
                type, userId);
        return lentExtensionRepository.save(lentExtension);
    }

    /**
     * 연장권을 사용합니다.
     *
     * @param lentExtension 연장권
     * @param lentHistories 연장권을 사용할 사물함에 대한 대여 기록
     */
    public void useLentExtension(LentExtension lentExtension, List<LentHistory> lentHistories) {
        lentExtension.use();
        lentHistories.forEach(lentHistory ->
                lentHistory.setExpiredAt(
                        lentHistory.getExpiredAt().plusDays(lentExtension.getExtensionPeriod())));
    }
}
