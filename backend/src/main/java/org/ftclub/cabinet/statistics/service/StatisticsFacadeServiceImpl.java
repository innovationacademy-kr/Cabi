package org.ftclub.cabinet.statistics.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.statistics.repository.StatisticsRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class StatisticsFacadeServiceImpl implements StatisticsFacadeService {

    private final StatisticsRepository statisticsRepository;
    private final CabinetRepository cabinetRepository;
    private final UserRepository userRepository;
    private final LentRepository lentRepository;

    /**
     *
     * @return
     */
    @Override
    public List<CabinetFloorStatisticsResponseDto> getCabinetsCountOnAllFloors() {
        List<CabinetFloorStatisticsResponseDto> cabinetFloorStatisticsResponseDtos = new ArrayList<>();
        List<Integer> floors = cabinetRepository.findAllFloorsByBuilding("새롬관").orElseThrow();
        for (Integer floor : floors) {
            Integer used = statisticsRepository.getCabinetsCountByStatus(floor, CabinetStatus.FULL);
            List<Long> availableCabinetsId = statisticsRepository.getAvailableCabinetsId();
            Integer unused = 0;
            for (Long cabinetId : availableCabinetsId) {
                if (lentRepository.countCabinetActiveLent(cabinetId) > 0)
                    used++;
                else
                    unused++;
            };
            Integer overdue = statisticsRepository.getCabinetsCountByStatus(floor, CabinetStatus.OVERDUE);
            Integer disabled = statisticsRepository.getCabinetsCountByStatus(floor, CabinetStatus.BROKEN);
            Integer total = used + overdue + unused + disabled;
            cabinetFloorStatisticsResponseDtos.add(new CabinetFloorStatisticsResponseDto(floor, total, used, overdue, unused, disabled));
        }
        return cabinetFloorStatisticsResponseDtos;
    }

    /**
     *
     * @param startDate
     * @param endDate
     * @return
     */
    @Override
    public LentsStatisticsResponseDto getCountOnLentAndReturn(Date startDate, Date endDate) {
        List<Date> lents = statisticsRepository.getLents();
        AtomicInteger lentsCount = new AtomicInteger(0);
        lents.stream().forEach( (lentDate) -> {
           if (lentDate.after(startDate) && lentDate.before(endDate))
               lentsCount.incrementAndGet();
        });
        List<Date> returns = statisticsRepository.getReturns();
        AtomicInteger returnsCount = new AtomicInteger(0);
        returns.stream().forEach( (returnDate) -> {
            if (returnDate.after(startDate) && returnDate.before(endDate))
                returnsCount.incrementAndGet();
        });
        return new LentsStatisticsResponseDto(startDate, endDate, lentsCount.get(), returnsCount.get());
    }

    /**
     *
     * @param page
     * @param length
     * @return
     */
    @Override
    public BlockedUserPaginationDto getUsersBannedInfo(Integer page, Integer length) {
        PageRequest pageable = PageRequest.of(page, length);
        Page<Object[]> bannedInfo = statisticsRepository.getUsersBannedInfo(pageable);
        List<UserBlockedInfoDto> userBlockedInfoDtos = new ArrayList<>();
        bannedInfo.toList().stream().forEach( (objs) -> {
                    Long userId = (Long) objs[0];
                    String name = userRepository.findNameById(userId);
                    Date bannedAt = (Date) objs[1];
                    Date unbannedAt = (Date) objs[2];
            userBlockedInfoDtos.add(new UserBlockedInfoDto(userId, name, bannedAt, unbannedAt));
                });
        return new BlockedUserPaginationDto(userBlockedInfoDtos, Long.valueOf(bannedInfo.getTotalPages()));
    }

    /**
     *
     * @param page
     * @param length
     * @return
     */
    @Override
    public OverdueUserCabinetPaginationDto getOverdueUsers(Integer page, Integer length) {
        PageRequest pageable = PageRequest.of(page, length);
        Page<Object[]> overdueUsers = statisticsRepository.getOverdueUsers(pageable);
        List<OverdueUserCabinetDto> overdueUserCabinetDtos = new ArrayList<>();
        Date today = new Date();
        overdueUsers.toList().stream().forEach( (objs) -> {
            Long cabinetId = (Long) objs[0];
            Long userId = statisticsRepository.getUserIdByCabinetId(cabinetId);
            String name = userRepository.findNameById(userId);
            Location location = (Location) objs[1];
            Date expiredDate = statisticsRepository.getExpiredDateByCabinetId(cabinetId);
            // DB에 expire_time은 항상 23:59:59로 끝나기 때문에 1000 밀리초(1초)를 더해준 뒤 현재 시간과 비교해서 얼마나 연체되었는지 확인
            Long overdueDaysInMilliSec = today.getTime() - (expiredDate.getTime() + 1000);
            Integer overdueDays = (int) TimeUnit.DAYS.convert(overdueDaysInMilliSec, TimeUnit.MILLISECONDS);
            overdueUserCabinetDtos.add(new OverdueUserCabinetDto(name, cabinetId, location, overdueDays));
        });
        return new OverdueUserCabinetPaginationDto(overdueUserCabinetDtos, overdueUsers.getTotalPages());
    }
}
