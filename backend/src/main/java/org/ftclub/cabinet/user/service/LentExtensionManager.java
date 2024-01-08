package org.ftclub.cabinet.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.dto.UserMonthDataDto;
import org.ftclub.cabinet.occupiedtime.OccupiedTimeManager;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class LentExtensionManager {
    private final CabinetProperties cabinetProperties;
    private final LentExtensionRepository lentExtensionRepository;
    private final LentExtensionCommandService lentExtensionCommandService;

    private final UserOptionalFetcher userOptionalFetcher;
    private final OccupiedTimeManager occupiedTimeManager;

    public void issueLentExtension() {
        log.debug("Called issueLentExtension");

        List<UserMonthDataDto> userMonthDataDtos = occupiedTimeManager.filterToMetUserMonthlyTime(
                occupiedTimeManager.getUserLastMonthOccupiedTime());

        LocalDateTime now = LocalDateTime.now();
        userMonthDataDtos.forEach(userMonthDataDto -> {
            Long userId = userOptionalFetcher.findUserByName(userMonthDataDto.getLogin()).getId();
            lentExtensionCommandService.createLentExtension(userId, LentExtensionType.ALL,
                    LocalDateTime.of(now.getYear(), now.getMonth(),
                            now.getMonth().length(now.toLocalDate().isLeapYear()), 23, 59, 0));
        });
    }


}
