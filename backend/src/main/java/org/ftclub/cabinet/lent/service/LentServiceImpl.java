package org.ftclub.cabinet.lent.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LentServiceImpl implements LentService {
    private final LentRepository lentRepository;
    private final LentPolicy lentPolicy;
    private final LentExceptionHandlerService lentExceptionHandler;
    private final UserService userService;
    private final CabinetService cabinetService;

    @Override
    public void startLentCabinet(Long userId, Long cabinetId) {
        Date now = new Date();
        Cabinet cabinet = lentExceptionHandler.getCabinet(cabinetId);
        User user = lentExceptionHandler.getUser(userId);
        int userLentCount = lentRepository.countUserActiveLent(userId);
        LentHistory cabinetActiveLentHistory =
            lentRepository.findFirstByCabinetIdAndEndedAtIsNull(cabinetId).orElse(null);

        lentExceptionHandler.handlePolicyStatus(
                lentPolicy.verifyCabinetForLent(cabinet, cabinetActiveLentHistory, now));
        lentExceptionHandler.handlePolicyStatus(
                lentPolicy.verifyUserForLent(user, userLentCount));
        Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet.getLentType(), cabinetActiveLentHistory);
        LentHistory result =
                new LentHistory(now, expirationDate, userId, cabinetId);
        lentRepository.save(result);
    }

    @Override
    public void startLentClubCabinet(Long userId, Long cabinetId) {
        Date now = new Date();
        Cabinet cabinet = lentExceptionHandler.getClubCabinet(cabinetId);
        lentExceptionHandler.getClubUser(userId);
        lentExceptionHandler.checkEmptyCabinet(cabinetId);
        Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet.getLentType(), null);
        LentHistory result =
                new LentHistory(now, expirationDate, userId, cabinetId);
        lentRepository.save(result);
        cabinetService.enterOneUser(cabinetId);
    }

    @Override
    public void endLentCabinet(Long userId) {
        LentHistory lentHistory = returnCabinet(userId);
        userService.banUser(userId, lentHistory);
    }

    @Override
    public void terminateLentCabinet(Long userId) {
        returnCabinet(userId);
    }

    @Override
    public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page, Integer length) {
        PageRequest pageable = PageRequest.of(page, length, Sort.by("STARTED_AT"));
        List<LentHistory> lentHistories = lentRepository.findByUserId(userId, pageable);
        int totalLength = lentRepository.countUserAllLent(userId);
        return generateLentHistoryPaginationDto(lentHistories, totalLength);
    }

    @Override
    public LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page, Integer length) {
        PageRequest pageable = PageRequest.of(page, length, Sort.by("STARTED_AT"));
        List<LentHistory> lentHistories = lentRepository.findByCabinetId(cabinetId, pageable);
        int totalLength = lentRepository.countCabinetAllLent(cabinetId);
        return generateLentHistoryPaginationDto(lentHistories, totalLength);
    }

    private LentHistoryPaginationDto generateLentHistoryPaginationDto(List<LentHistory> lentHistories, int totalLength) {
        List<LentHistoryDto> lentHistoryDto = lentHistories.stream()
                .map(e -> {
                    Cabinet cabinet = lentExceptionHandler.getCabinet(e.getCabinetId());
                    User user = lentExceptionHandler.getUser(e.getUserId());
                    return new LentHistoryDto(e.getUserId(), user.getName(),
                            e.getCabinetId(), cabinet.getVisibleNum(),
                            cabinet.getCabinetPlace().getLocation(),
                            e.getStartedAt(), e.getEndedAt());
                })
                .collect(Collectors.toList());
        return new LentHistoryPaginationDto(lentHistoryDto, totalLength);
    }

    private LentHistory returnCabinet(Long userId) {
        Date now = new Date();
        lentExceptionHandler.getUser(userId);
        LentHistory lentHistory = lentExceptionHandler.getActiveLentHistoryWithUserId(userId);
        int lentCount = lentRepository.countCabinetActiveLent(lentHistory.getCabinetId());
        lentHistory.endLent(now);
        cabinetService.exitOneUser(lentHistory.getCabinetId(), lentCount);
        return lentHistory;
    }
}
