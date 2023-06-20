package org.ftclub.cabinet.statistics.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.statistics.repository.StatisticsRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class StatisticsFacadeServiceImpl implements StatisticsFacadeService {

	private final StatisticsRepository statisticsRepository;
	private final CabinetRepository cabinetRepository;
	private final LentRepository lentRepository;

	/**
	 * @return
	 */
	@Override
	public List<CabinetFloorStatisticsResponseDto> getCabinetsCountOnAllFloors() {
		log.info("Called getCabinetsCountOnAllFloors");
		List<CabinetFloorStatisticsResponseDto> cabinetFloorStatisticsResponseDtos = new ArrayList<>();
		List<Integer> floors = cabinetRepository.findAllFloorsByBuilding("새롬관").orElseThrow();
		for (Integer floor : floors) {
			Integer used = statisticsRepository.getCabinetsCountByStatus(floor, CabinetStatus.FULL);
			List<Long> availableCabinetsId = statisticsRepository.getAvailableCabinetsId();
			Integer unused = 0;
			for (Long cabinetId : availableCabinetsId) {
                if (lentRepository.countCabinetActiveLent(cabinetId) > 0) {
                    used++;
                } else {
                    unused++;
                }
			}
			;
			Integer overdue = statisticsRepository.getCabinetsCountByStatus(floor,
					CabinetStatus.OVERDUE);
			Integer disabled = statisticsRepository.getCabinetsCountByStatus(floor,
					CabinetStatus.BROKEN);
			Integer total = used + overdue + unused + disabled;
			cabinetFloorStatisticsResponseDtos.add(
					new CabinetFloorStatisticsResponseDto(floor, total, used, overdue, unused,
							disabled));
		}
		return cabinetFloorStatisticsResponseDtos;
	}

	/**
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	@Override
	public LentsStatisticsResponseDto getCountOnLentAndReturn(Integer startDate, Integer endDate) {
		log.info("Called getCountOnLentAndReturn");
		Date start = DateUtil.addDaysToDate(DateUtil.getNow(), startDate);
		Date end = DateUtil.addDaysToDate(DateUtil.getNow(), endDate);
		Integer lentStartCount = lentRepository.countLentByLentTimeBetween(start, end);
		Integer lentEndCount = lentRepository.countLentByReturnTimeBetween(start, end);
		return new LentsStatisticsResponseDto(start, end, lentStartCount, lentEndCount);
	}
}
