package org.ftclub.cabinet.statistics.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.statistics.repository.StatisticsRepository;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.ftclub.cabinet.utils.DateUtil;
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

        Integer lentStartCount = lentRepository.countLentByLentTimeBetween(startDate, endDate);
        Integer lentEndCount = lentRepository.countLentByReturnTimeBetween(startDate, endDate);
        return new LentsStatisticsResponseDto(startDate, endDate, lentStartCount, lentEndCount);
    }
}
