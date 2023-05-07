package org.ftclub.cabinet.lent.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.service.CabinetExceptionHandlerService;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class LentServiceImpl implements LentService {

	private final LentRepository lentRepository;
	private final LentPolicy lentPolicy;
	private final LentExceptionHandlerService lentExceptionHandler;
	private final CabinetExceptionHandlerService cabinetExceptionHandler;
	private final UserService userService;
	private final CabinetService cabinetService;
	private final LentMapper lentMapper;
	private final BanHistoryRepository banHistoryRepository;

	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		Date now = new Date();
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(cabinetId);
		User user = lentExceptionHandler.getUser(userId);
		int userActiveLentCount = lentRepository.countUserActiveLent(userId);
		List<BanHistory> userActiveBanList = banHistoryRepository.findUserActiveBanList(userId);
		// 대여 가능한 유저인지 확인
		lentExceptionHandler.handlePolicyStatus(
				lentPolicy.verifyUserForLent(user, cabinet, userActiveLentCount,
						userActiveBanList));
		List<LentHistory> cabinetActiveLentHistories = lentRepository.findAllActiveLentByCabinetId(
				cabinetId);
		// 대여 가능한 캐비넷인지 확인
		lentExceptionHandler.handlePolicyStatus(
				lentPolicy.verifyCabinetForLent(cabinet, cabinetActiveLentHistories, now));
		// 캐비넷 상태 변경
		cabinet.specifyStatusByUserCount(cabinetActiveLentHistories.size() + 1);
		Date expiredAt = lentPolicy.generateExpirationDate(now, cabinet);
		LentHistory lentHistory = LentHistory.of(now, userId, cabinetId);
		// 연체 시간 적용
		lentPolicy.applyExpirationDate(lentHistory, cabinetActiveLentHistories, expiredAt);
		lentRepository.save(lentHistory);
	}

	@Override
	public void startLentClubCabinet(Long userId, Long cabinetId) {
		Date now = new Date();
		Cabinet cabinet = cabinetExceptionHandler.getClubCabinet(cabinetId);
		lentExceptionHandler.getClubUser(userId);
		lentExceptionHandler.checkExistedSpace(cabinetId);
		Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet);
		LentHistory result =
				LentHistory.of(now, expirationDate, userId, cabinetId);
		lentRepository.save(result);
		cabinetService.updateStatusByUserCount(cabinetId, 1);
	}

	@Override
	public void endLentCabinet(Long userId) {
		LentHistory lentHistory = returnCabinet(userId);
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(lentHistory.getCabinetId());
		// cabinetType도 인자로 전달하면 좋을 거 같습니다 (공유사물함 3일이내 반납 페널티)
		userService.banUser(userId, cabinet.getLentType(), lentHistory.getStartedAt(),
				lentHistory.getEndedAt());
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		returnCabinet(userId);
	}

	@Override
	public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page,
			Integer length) {
		PageRequest pageable = PageRequest.of(page, length, Sort.by("STARTED_AT"));
		List<LentHistory> lentHistories = lentRepository.findByUserId(userId, pageable);
		int totalLength = lentRepository.countUserAllLent(userId);
		return generateLentHistoryPaginationDto(lentHistories, totalLength);
	}

	@Override
	public LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
			Integer length) {
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
						lentExceptionHandler.getUser(e.getUserId()).getName(),
						e.getLentHistoryId(),
						e.getStartedAt(),
						e.getExpiredAt()))
				.collect(Collectors.toList());
	}

	private LentHistoryPaginationDto generateLentHistoryPaginationDto(
			List<LentHistory> lentHistories, int totalLength) {
		List<LentHistoryDto> lentHistoryDto = lentHistories.stream()
				.map(e -> lentMapper.toLentHistoryDto(e,
						lentExceptionHandler.getUser(e.getUserId()),
						cabinetExceptionHandler.getCabinet(e.getCabinetId()),
						new Location())) // TODO: 정확한 Location 필요
				.collect(Collectors.toList());
		return new LentHistoryPaginationDto(lentHistoryDto, totalLength);
	}

	private LentHistory returnCabinet(Long userId) {
		Date now = new Date();
		lentExceptionHandler.getUser(userId);
		LentHistory lentHistory = lentExceptionHandler.getActiveLentHistoryWithUserId(userId);
		int activeLentCount = lentRepository.countCabinetActiveLent(lentHistory.getCabinetId());
		lentHistory.endLent(now);
		cabinetService.updateStatusByUserCount(lentHistory.getCabinetId(), activeLentCount - 1);
		return lentHistory;
	}
}
