package org.ftclub.cabinet.lent.service;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetExceptionHandlerService;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.lent.controller.PaginationRequestDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.UserSession;
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
	private final CabinetService cabinetService;

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

	/**
	 * {@InheritDocs}
	 * @param user                 유저 정보
	 * @param paginationRequestDto 페이지네이션 정보
	 * @return
	 */
	@Override
	public LentHistoryPaginationDto getMyLentLog(UserSessionDto user,
			PaginationRequestDto paginationRequestDto) {
		PageRequest pageable = PageRequest.of(paginationRequestDto.getPage(), paginationRequestDto.getLength(), Sort.by("STARTED_AT"));
        List<LentHistory> myLentHistories = lentRepository.findByUserId(user.getUserId(), pageable);
		List<LentHistoryDto> result =  myLentHistories.stream()
				.map(lentHistory -> lentMapper.toLentHistoryDto(
						lentHistory,
						userExceptionHandler.getUser(user.getUserId()),
						cabinetExceptionHandler.getCabinet(lentHistory.getCabinetId())))
				.collect(Collectors.toList());
		return lentMapper.toLentHistoryPaginationDto(result,
				paginationRequestDto.getLength() * paginationRequestDto.getPage());
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
	public void endLentCabinet(UserSessionDto user) {
		lentService.endLentCabinet(user.getUserId());
	}

	@Override
	public void endLentCabinetWithMemo(UserSessionDto user, LentEndMemoDto lentEndMemoDto){
		Cabinet cabinet = cabinetService.getLentCabinetByUserId(user.getUserId());
		cabinetService.updateMemo(cabinet.getCabinetId(), lentEndMemoDto.getCabinetMemo());
		lentService.endLentCabinet(user.getUserId());
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		lentService.terminateLentCabinet(userId);
	}

    @Override
    public MyCabinetInfoResponseDto getMyLentInfo(@UserSession UserSessionDto user) {
		Cabinet myCabinet = cabinetService.getLentCabinetByUserId(user.getUserId());
		MyCabinetInfoResponseDto
	}

	@Override
	public void updateCabinetMemo(UserSessionDto user, UpdateCabinetMemoDto updateCabinetMemoDto) {
		Cabinet myCabinet = cabinetService.getLentCabinetByUserId((user.getUserId()));
		cabinetService.updateMemo(myCabinet.getCabinetId(), updateCabinetMemoDto.getMemo());
	}

	@Override
	public void updateCabinetTitle(UserSessionDto user, UpdateCabinetTitleDto updateCabinetTitleDto) {
		Cabinet myCabinet = cabinetService.getLentCabinetByUserId(user.getUserId());
		cabinetService.updateTitle(myCabinet.getCabinetId(), updateCabinetTitleDto.getCabinetTitle());
	}
}
