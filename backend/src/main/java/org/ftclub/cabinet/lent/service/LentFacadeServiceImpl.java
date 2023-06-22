package org.ftclub.cabinet.lent.service;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.CabinetInfoRequestDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.ReturnCabinetsRequestDto;
import org.ftclub.cabinet.dto.UpdateCabinetMemoDto;
import org.ftclub.cabinet.dto.UpdateCabinetTitleDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.UserSession;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Transactional
@Log4j2
public class LentFacadeServiceImpl implements LentFacadeService {

	private final UserOptionalFetcher userOptionalFetcher;
	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final LentOptionalFetcher lentOptionalFetcher;
	private final LentService lentService;
	private final LentMapper lentMapper;
	private final CabinetService cabinetService;
	private final CabinetMapper cabinetMapper;


	/*-------------------------------------------READ-------------------------------------------*/

	@Override
	public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page,
			Integer size) {
		log.info("Called getAllUserLentHistories: {}", userId);
		userOptionalFetcher.findUser(userId);
		//todo: 예쁘게 수정
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size, Sort.by("startedAt"));
		List<LentHistory> lentHistories = lentOptionalFetcher.findByUserId(userId, pageable);
		int totalLength = lentOptionalFetcher.countUserAllLent(userId);
		return generateLentHistoryPaginationDto(lentHistories, totalLength);
	}

	@Override
	public LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
			Integer size) {
		log.info("Called getAllCabinetLentHistories: {}", cabinetId);
		cabinetOptionalFetcher.getCabinet(cabinetId);
		PageRequest pageable = PageRequest.of(page, size, Sort.by("startedAt"));
		List<LentHistory> lentHistories = lentOptionalFetcher.findByCabinetId(cabinetId, pageable);
		int totalLength = lentOptionalFetcher.countCabinetAllLent(cabinetId);
		return generateLentHistoryPaginationDto(lentHistories, totalLength);
	}

	@Override
	public List<LentDto> getLentDtoList(Long cabinetId) {
		log.info("Called getLentDtoList: {}", cabinetId);
		cabinetOptionalFetcher.getCabinet(cabinetId);
		List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentByCabinetId(
				cabinetId);
		return lentHistories.stream()
				.map(e -> new LentDto(
						e.getUserId(),
						userOptionalFetcher.findUser(e.getUserId()).getName(),
						e.getLentHistoryId(),
						e.getStartedAt(),
						e.getExpiredAt()))
				.collect(Collectors.toList());
	}

	/**
	 * {@InheritDocs}
	 *
	 * @param user 유저 정보
	 * @param page 페이지
	 * @param size 사이즈
	 * @return
	 */
	@Override
	public LentHistoryPaginationDto getMyLentLog(UserSessionDto user,
			Integer page, Integer size) {
		log.info("Called getMyLentLog: {}", user.getName());
		PageRequest pageable = PageRequest.of(page, size, Sort.by("startedAt"));
		List<LentHistory> myLentHistories = lentOptionalFetcher.findByUserId(user.getUserId(),
				pageable);
		List<LentHistoryDto> result = myLentHistories.stream()
				.map(lentHistory -> lentMapper.toLentHistoryDto(
						lentHistory,
						userOptionalFetcher.findUser(user.getUserId()),
						cabinetOptionalFetcher.findCabinet(lentHistory.getCabinetId())))
				.collect(Collectors.toList());
		// TODO: totalPage로 바꾸기
		return lentMapper.toLentHistoryPaginationDto(result, result.size() / size);
	}

	private LentHistoryPaginationDto generateLentHistoryPaginationDto(
			List<LentHistory> lentHistories, int totalPage) {
		List<LentHistoryDto> lentHistoryDto = lentHistories.stream()
				.map(e -> lentMapper.toLentHistoryDto(e,
						userOptionalFetcher.findUser(e.getUserId()),
						cabinetOptionalFetcher.findCabinet(e.getCabinetId())))
				.collect(Collectors.toList());
		return new LentHistoryPaginationDto(lentHistoryDto, totalPage);
	}

	@Override
	public MyCabinetResponseDto getMyLentInfo(@UserSession UserSessionDto user) {
		log.info("Called getMyLentInfo: {}", user.getName());
		Cabinet myCabinet = lentOptionalFetcher.findActiveLentCabinetByUserId(user.getUserId());
		if (myCabinet == null) {
			return null;
		}
		List<LentDto> lentDtoList = getLentDtoList(myCabinet.getCabinetId());
		return cabinetMapper.toMyCabinetResponseDto(myCabinet, lentDtoList);
	}

	/*--------------------------------------------CUD--------------------------------------------*/

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
	public void endLentCabinetWithMemo(UserSessionDto user, LentEndMemoDto lentEndMemoDto) {
		log.info("Called endLentCabinetWithMemo: {}", user.getName());
		Cabinet cabinet = cabinetService.getLentCabinetByUserId(user.getUserId());
		lentService.endLentCabinet(user.getUserId());
		cabinetService.updateMemo(cabinet.getCabinetId(), lentEndMemoDto.getCabinetMemo());
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		lentService.terminateLentCabinet(userId);
	}

	@Override
	public void terminateLentCabinets(ReturnCabinetsRequestDto returnCabinetsRequestDto) {
		log.info("Called terminateLentCabinets");
		returnCabinetsRequestDto.getCabinetIds().stream()
				.forEach(lentService::terminateLentByCabinetId);
	}

	@Override
	public void updateCabinetMemo(UserSessionDto user, UpdateCabinetMemoDto updateCabinetMemoDto) {
		log.info("Called updateCabinetMemo: {}", user.getName());
		Cabinet myCabinet = cabinetService.getLentCabinetByUserId((user.getUserId()));
		cabinetService.updateMemo(myCabinet.getCabinetId(), updateCabinetMemoDto.getMemo());
	}

	@Override
	public void updateCabinetTitle(UserSessionDto user,
			UpdateCabinetTitleDto updateCabinetTitleDto) {
		log.info("Called updateCabinetTitle: {}", user.getName());
		Cabinet myCabinet = cabinetService.getLentCabinetByUserId(user.getUserId());
		cabinetService.updateTitle(myCabinet.getCabinetId(),
				updateCabinetTitleDto.getCabinetTitle());
	}

	@Override
	public void updateCabinetInfo(UserSessionDto user,
			CabinetInfoRequestDto cabinetInfoRequestDto) {
		log.info("Called updateCabinetInfo: {}", user.getName());

		Cabinet myCabinet = cabinetService.getLentCabinetByUserId(user.getUserId());

		cabinetService.updateTitleAndMemo(myCabinet.getCabinetId(),
				cabinetInfoRequestDto.getTitle(),
				cabinetInfoRequestDto.getMemo());
	}


	@Override
	public void assignLent(Long userId, Long cabinetId) {
		lentService.assignLent(userId, cabinetId);
	}
}
