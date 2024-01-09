package org.ftclub.cabinet.user.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserMonthDataDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.occupiedtime.OccupiedTimeManager;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Logging(level = LogLevel.DEBUG)
public class LentExtensionManager {
    private final LentExtensionCommandService lentExtensionCommandService;

    private final OccupiedTimeManager occupiedTimeManager;
    private final UserQueryService userQueryService;

    /**
     * 연장권을 발급합니다.
     */
    public void issueLentExtension() {
        List<UserMonthDataDto> userMonthDataDtos = occupiedTimeManager.filterToMetUserMonthlyTime(
                occupiedTimeManager.getUserLastMonthOccupiedTime());
        List<String> userNames = userMonthDataDtos.stream().map(UserMonthDataDto::getLogin).collect(Collectors.toList());

        LocalDateTime now = LocalDateTime.now();
        List<User> users = userQueryService.findAllUsersByNames(userNames);
        users.forEach(user -> lentExtensionCommandService.createLentExtension(user.getId(), LentExtensionType.ALL,
                LocalDateTime.of(now.getYear(), now.getMonth(),
                        now.getMonth().length(now.toLocalDate().isLeapYear()), 23, 59, 0)));

    }
}
