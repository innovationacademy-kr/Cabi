package org.ftclub.cabinet.user.service;

import java.time.LocalDateTime;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.occupiedtime.OccupiedTimeManager;
import org.ftclub.cabinet.occupiedtime.UserMonthDataDto;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.repository.LentExtensionOptionalFetcher;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class LentExtensionServiceImpl implements LentExtensionService {

    private final LentExtensionRepository lentExtensionRepository;
    private final LentExtensionOptionalFetcher lentExtensionOptionalFetcher;
    private final LentOptionalFetcher lentOptionalFetcher;
    private final UserOptionalFetcher userOptionalFetcher;
    private final CabinetProperties cabinetProperties;
    private final OccupiedTimeManager occupiedTimeManager;

    @Override
    public Page<LentExtension> getAllLentExtension(PageRequest pageable) {
        return lentExtensionRepository.findAll(pageable);
    }

    @Override
    public Page<LentExtension> getAllActiveLentExtension(PageRequest pageable) {
        return lentExtensionRepository.findAllNotExpired(pageable);
    }

    @Override
    public List<LentExtension> getLentExtensionByUserId(Long userId) {
        return lentExtensionRepository.findAllByUserId(userId);
    }

    @Override
    public List<LentExtension> getLentExtensionNotExpiredByUserId(Long userId) {
        return lentExtensionRepository.findAllByUserIdNotExpired(userId);
    }

    @Override
    @Scheduled(cron = "${spring.schedule.cron.extension-issue-time}")
    public void issueLentExtension() {
        log.debug("Called issueLentExtension");
        List<UserMonthDataDto> userMonthDataDtos = occupiedTimeManager.metLimitTimeUser(
                occupiedTimeManager.getUserLastMonthOccupiedTime());
        LocalDateTime now = LocalDateTime.now();
        userMonthDataDtos.stream().forEach(userMonthDataDto -> {
            LentExtension lentExtension = LentExtension.of("lentExtension",
                    cabinetProperties.getLentExtendTerm(),
                    LocalDateTime.of(now.getYear(), now.getMonth(),
                            now.getMonth().length(now.toLocalDate().isLeapYear()), 23, 59, 0),
                    LentExtensionType.ALL,
                    userOptionalFetcher.findUserByName(userMonthDataDto.getLogin()).getUserId());
            lentExtensionRepository.save(lentExtension);
        });
    }

    @Override
    public void assignLentExtension(String username) {
        log.debug("Called assignLentExtension {}", username);
        LocalDateTime now = LocalDateTime.now();

        LentExtension lentExtension = LentExtension.of("lentExtension",
                cabinetProperties.getLentExtendTerm(),
                LocalDateTime.of(now.getYear(), now.getMonth(),
                        now.getMonth().length(now.toLocalDate().isLeapYear()), 23, 59, 0),
                LentExtensionType.ALL,
                userOptionalFetcher.findUserByName(username).getUserId());
        lentExtensionRepository.save(lentExtension);
    }

    @Override
    @Scheduled(cron = "${spring.schedule.cron.extension-delete-time}")
    public void deleteLentExtension() {
        log.debug("Called deleteExtension");
        lentExtensionRepository.deleteAll();
    }

    @Override
    public void useLentExtension(UserSessionDto userSessionDto) {
        log.debug("Called useLentExtension {}", userSessionDto);

        LentHistory lentHistory = lentOptionalFetcher.getActiveLentHistoryWithUserId(
                userSessionDto.getUserId());
        LentExtension findLentExtension = lentExtensionOptionalFetcher.getAvailableLentExtensionByUserId(
                userSessionDto.getUserId());

        findLentExtension.use();
        long extensionPeriod = findLentExtension.getExtensionPeriod();
        lentHistory.setExpiredAt(lentHistory.getExpiredAt().plusDays(extensionPeriod));
    }
}
