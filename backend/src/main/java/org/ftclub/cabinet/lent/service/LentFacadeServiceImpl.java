package org.ftclub.cabinet.lent.service;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.ftclub.cabinet.cabinet.service.CabinetExceptionHandlerService;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.service.UserExceptionHandlerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
@Transactional
public class LentFacadeServiceImpl implements LentFacadeService {

	private final LentRepository lentRepository;
	private final UserExceptionHandlerService userExceptionHandler;
	private final CabinetExceptionHandlerService cabinetExceptionHandler;
	private final LentService lentService;
	private final LentMapper lentMapper;

	@Override
	public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page,
			Integer length) {
		userExceptionHandler.getUser(userId);
		PageRequest pageable = PageRequest.of(page, length, Sort.by("STARTED_AT"));
		List<LentHistory> lentHistories = lentRepository.findByUserId(userId, pageable);
		int totalLength = lentRepository.countUserAllLent(userId);
		return generateLentHistoryPaginationDto(lentHistories, totalLength);
	}

	@Override
	public LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
			Integer length) {
		cabinetExceptionHandler.getCabinet(cabinetId);
		PageRequest pageable = PageRequest.of(page, length, Sort.by("STARTED_AT"));
		List<LentHistory> lentHistories = lentRepository.findByCabinetId(cabinetId, pageable);
		int totalLength = lentRepository.countCabinetAllLent(cabinetId);
		return generateLentHistoryPaginationDto(lentHistories, totalLength);
	}

	@Override
	public List<LentDto> getLentDtoList(Long cabinetId) {
		cabinetExceptionHandler.getCabinet(cabinetId);
		List<LentHistory> lentHistories = lentRepository.findAllActiveLentByCabinetId(cabinetId);
		return lentHistories.stream()
				.map(e -> new LentDto(
						e.getUserId(),
						userExceptionHandler.getUser(e.getUserId()).getName(),
						e.getLentHistoryId(),
						e.getStartedAt(),
						e.getExpiredAt()))
				.collect(Collectors.toList());
	}

	private LentHistoryPaginationDto generateLentHistoryPaginationDto(
			List<LentHistory> lentHistories, int totalLength) {
		List<LentHistoryDto> lentHistoryDto = lentHistories.stream()
				.map(e -> lentMapper.toLentHistoryDto(e,
						userExceptionHandler.getUser(e.getUserId()),
						cabinetExceptionHandler.getCabinet(e.getCabinetId())))
				.collect(Collectors.toList());
		return new LentHistoryPaginationDto(lentHistoryDto, totalLength);
	}

	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		lentService.startLentCabinet(userId, cabinetId);
	}

	@Override
	public void startLentClubCabinet(Long userId, Long cabinetId) {
		lentService.startLentClubCabinet(userId, cabinetId);
	}

	@Override
	public void endLentCabinet(Long userId) {
		lentService.endLentCabinet(userId);
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		lentService.terminateLentCabinet(userId);
	}
}
