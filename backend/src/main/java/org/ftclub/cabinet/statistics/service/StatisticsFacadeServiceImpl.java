package org.ftclub.cabinet.statistics.service;

import static org.ftclub.cabinet.utils.ExceptionUtil.throwIfFalse;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.ftclub.cabinet.dto.LentsStatisticsResponseDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.statistics.repository.StatisticsRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class StatisticsFacadeServiceImpl implements StatisticsFacadeService {

	private final StatisticsRepository statisticsRepository;
	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final LentRepository lentRepository;

	// TODO: 로직 수정 필요

	/**
	 * @return
	 */
	@Override
	public List<CabinetFloorStatisticsResponseDto> getCabinetsCountOnAllFloors() {
		log.debug("Called getCabinetsCountOnAllFloors");
		List<CabinetFloorStatisticsResponseDto> cabinetFloorStatisticsResponseDtos = new ArrayList<>();
		List<Integer> floors = cabinetOptionalFetcher.findAllFloorsByBuilding("새롬관");
		throwIfFalse(floors != null, new ServiceException(ExceptionStatus.INVALID_ARGUMENT));
		for (Integer floor : floors) {
			Integer used = statisticsRepository.getCabinetsCountByStatus(floor, CabinetStatus.FULL);
			List<Long> availableCabinetsId = statisticsRepository.getAvailableCabinetsId(floor);
			Integer unused = 0;
			for (Long cabinetId : availableCabinetsId) {
				if (lentRepository.countCabinetActiveLent(cabinetId) > 0) {
					used++;
				} else {
					unused++;
				}
			}
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
	public LentsStatisticsResponseDto getCountOnLentAndReturn(LocalDateTime startDate,
			LocalDateTime endDate) {
		log.debug("Called getCountOnLentAndReturn");
		throwIfFalse(startDate.isBefore(endDate),
				new ServiceException(ExceptionStatus.INVALID_ARGUMENT));
		Integer lentStartCount = lentRepository.countLentByTimeDuration(startDate, endDate);
		Integer lentEndCount = lentRepository.countReturnByTimeDuration(startDate, endDate);
		return new LentsStatisticsResponseDto(startDate, endDate, lentStartCount, lentEndCount);
	}
}
