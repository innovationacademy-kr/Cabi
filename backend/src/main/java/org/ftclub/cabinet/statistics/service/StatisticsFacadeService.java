package org.ftclub.cabinet.statistics.service;

import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface StatisticsFacadeService {

    List<CabinetFloorStatisticsResponseDto> getCabinetsCountOnAllFloors();

    LentsStatisticsResponseDto getCountOnLentAndReturn(LocalDateTime startDate, LocalDateTime endDate);
}
