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
import org.ftclub.cabinet.redis.TicketingSharedCabinet;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserSession;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.data.domain.Page;
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
	private final TicketingSharedCabinet ticketingSharedCabinet;

	/*-------------------------------------------READ-------------------------------------------*/

	@Override
	public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page,
			Integer size) {
		log.debug("Called getAllUserLentHistories: {}", userId);
		userOptionalFetcher.findUser(userId);
		//todo: 예쁘게 수정
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size, Sort.by("startedAt"));
		Page<LentHistory> lentHistories = lentOptionalFetcher.findPaginationByUserId(userId,
				pageable);
		return generateLentHistoryPaginationDto(lentHistories.toList(),
				lentHistories.getTotalElements());
	}

	@Override
	public LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
			Integer size) {
		log.debug("Called getAllCabinetLentHistories: {}", cabinetId);
		cabinetOptionalFetcher.getCabinet(cabinetId);
		PageRequest pageable = PageRequest.of(page, size, Sort.by("startedAt"));
		Page<LentHistory> lentHistories = lentOptionalFetcher.findPaginationByCabinetId(cabinetId,
				pageable);
		return generateLentHistoryPaginationDto(lentHistories.toList(),
				lentHistories.getTotalElements());
	}

	@Override
	public List<LentDto> getLentDtoList(Long cabinetId) {
		log.debug("Called getLentDtoList: {}", cabinetId);
		cabinetOptionalFetcher.getCabinet(cabinetId);
		List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentByCabinetId(
				cabinetId);
		return lentHistories.stream().map(
				e -> lentMapper.toLentDto(e.getUser(), e)).collect(Collectors.toList());
//		return lentHistories.stream()
//				.map(e -> new LentDto(
//						e.getUserId(),
//						e.getUser().getName(),
//						e.getLentHistoryId(),
//						e.getStartedAt(),
//						e.getExpiredAt()))
//				.collect(Collectors.toList());
	}

	@Override
	public List<LentDto> getLentDtoListFromRedis(Long cabinetId) {
		log.debug("Called getLentDtoListFromRedis: {}", cabinetId);

		List<Long> userIds = lentOptionalFetcher.findUserIdsByCabinetIdFromRedis(cabinetId);
		return userIds.stream().map(
				userId -> {
					User user = userOptionalFetcher.findUser(userId);
					return new LentDto(
							user.getUserId(),
							user.getName(),
							null,
							null,
							null);
				}).collect(Collectors.toList());
	}

	/**
	 * {@InheritDocs}
	 *
	 * @param user 유저 정보
	 * @param page 페이지
	 * @param size 사이즈
	 * @return LentHistoryPaginationDto 본인의 lent log
	 */
	@Override
	public LentHistoryPaginationDto getMyLentLog(UserSessionDto user,
			Integer page, Integer size) {
		log.debug("Called getMyLentLog: {}", user.getName());
		PageRequest pageable = PageRequest.of(page, size,
				Sort.by(Sort.Direction.DESC, "startedAt"));
		List<LentHistory> myLentHistories = lentOptionalFetcher.findByUserIdAndEndedAtNotNull(
				user.getUserId(),
				pageable);
		List<LentHistoryDto> result = myLentHistories.stream()
				.map(lentHistory -> lentMapper.toLentHistoryDto(
						lentHistory,
						lentHistory.getUser(),
						lentHistory.getCabinet()))
				.collect(Collectors.toList());
		return lentMapper.toLentHistoryPaginationDto(result, Long.valueOf(result.size()));
	}

	private LentHistoryPaginationDto generateLentHistoryPaginationDto(
			List<LentHistory> lentHistories, Long totalLength) {
		List<LentHistoryDto> lentHistoryDto = lentHistories.stream()
				.map(e -> lentMapper.toLentHistoryDto(e,
						e.getUser(),
						e.getCabinet()))
				.collect(Collectors.toList());
		return new LentHistoryPaginationDto(lentHistoryDto, totalLength);
	}

	@Override
	public MyCabinetResponseDto getMyLentInfo(@UserSession UserSessionDto user) {
		log.debug("Called getMyLentInfo: {}", user.getName());
		Cabinet myCabinet = lentOptionalFetcher.findActiveLentCabinetByUserId(user.getUserId());
		if (myCabinet == null) { // 대여 기록이 없거나 대여 대기 중인 경우
			return getMyLentInfoFromRedis(user);
		}
		List<LentDto> lentDtoList = getLentDtoList(myCabinet.getCabinetId());
		return cabinetMapper.toMyCabinetResponseDto(myCabinet, lentDtoList,
				null, null);
	}

	@Override
	public MyCabinetResponseDto getMyLentInfoFromRedis(@UserSession UserSessionDto user) {
		log.debug("Called getMyLentInfoFromRedis: {}", user.getName());
		Long userId = user.getUserId();
		Long cabinetId = lentOptionalFetcher.findCabinetIdByUserIdFromRedis(userId);
		if (cabinetId == null) {
			return null;
		}
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		List<LentDto> lentDtoList = getLentDtoListFromRedis(cabinetId);
		return cabinetMapper.toMyCabinetResponseDto(cabinet, lentDtoList,
				ticketingSharedCabinet.getShareCode(cabinetId),
				ticketingSharedCabinet.getSessionExpiredAt(cabinetId));
	}


	/*--------------------------------------------CUD--------------------------------------------*/

	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		lentService.startLentCabinet(userId, cabinetId);
	}

	@Override
	public void startLentShareCabinet(Long userId, Long cabinetId, Integer shareCode) {
		lentService.startLentShareCabinet(userId, cabinetId, shareCode);
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
		log.debug("Called endLentCabinetWithMemo: {}", user.getName());
		Cabinet cabinet = cabinetService.getLentCabinetByUserId(user.getUserId());
		lentService.endLentCabinet(user.getUserId());
		cabinetService.updateMemo(cabinet.getCabinetId(), lentEndMemoDto.getCabinetMemo());
	}

	@Override
	public void cancelLentShareCabinet(Long userId, Long cabinetId) {
		lentService.cancelLentShareCabinet(userId, cabinetId);
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		lentService.terminateLentCabinet(userId);
	}

	@Override
	public void terminateLentCabinets(ReturnCabinetsRequestDto returnCabinetsRequestDto) {
		log.debug("Called terminateLentCabinets");
		returnCabinetsRequestDto.getCabinetIds().stream()
				.forEach(lentService::terminateLentByCabinetId);
	}

	@Override
	public void updateCabinetMemo(UserSessionDto user, UpdateCabinetMemoDto updateCabinetMemoDto) {
		log.debug("Called updateCabinetMemo: {}", user.getName());
		Cabinet myCabinet = cabinetService.getLentCabinetByUserId((user.getUserId()));
		cabinetService.updateMemo(myCabinet.getCabinetId(), updateCabinetMemoDto.getMemo());
	}

	@Override
	public void updateCabinetTitle(UserSessionDto user,
			UpdateCabinetTitleDto updateCabinetTitleDto) {
		log.debug("Called updateCabinetTitle: {}", user.getName());
		Cabinet myCabinet = cabinetService.getLentCabinetByUserId(user.getUserId());
		cabinetService.updateTitle(myCabinet.getCabinetId(),
				updateCabinetTitleDto.getCabinetTitle());
	}

	@Override
	public void updateCabinetInfo(UserSessionDto user,
			CabinetInfoRequestDto cabinetInfoRequestDto) {
		log.debug("Called updateCabinetInfo: {}", user.getName());

		Cabinet myCabinet = cabinetService.getLentCabinetByUserId(user.getUserId());

		cabinetService.updateTitleAndMemo(myCabinet.getCabinetId(),
				cabinetInfoRequestDto.getTitle(),
				cabinetInfoRequestDto.getMemo());
	}

	@Override
	public void assignLent(Long userId, Long cabinetId) {
		lentService.assignLent(userId, cabinetId);
	}

	@Override
	public void extendLent(Long userId, Long cabinetId) {
		log.info("Called extendLent userId: {}, cabinetId: {}", userId, cabinetId);
		lentService.extendLentCabinet(userId, cabinetId);
	}
}
