package org.ftclub.cabinet.lent.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
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
	private final UserService userService;
	private final CabinetService cabinetService;
	private final LentMapper lentMapper;

	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		Date now = new Date();
		Cabinet cabinet = lentExceptionHandler.getCabinet(cabinetId);
		User user = lentExceptionHandler.getUser(userId);
		int userActiveLentCount = lentRepository.countUserActiveLent(userId);
		LentHistory cabinetActiveLentHistory =
				lentRepository.findFirstByCabinetIdAndEndedAtIsNull(cabinetId).orElse(null);

		lentExceptionHandler.handlePolicyStatus(
				lentPolicy.verifyCabinetForLent(cabinet, cabinetActiveLentHistory, now));
		lentExceptionHandler.handlePolicyStatus(
				lentPolicy.verifyUserForLent(user, userActiveLentCount));
		Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet.getLentType(),
				cabinetActiveLentHistory);
		LentHistory result =
				LentHistory.of(now, expirationDate, userId, cabinetId);
		cabinetService.updateStatusByUserCount(cabinetId, userActiveLentCount + 1);
		lentRepository.save(result);
	}

	@Override
	public void startLentClubCabinet(Long userId, Long cabinetId) {
		Date now = new Date();
		Cabinet cabinet = lentExceptionHandler.getClubCabinet(cabinetId);
		lentExceptionHandler.getClubUser(userId);
		lentExceptionHandler.checkExistedSpace(cabinetId);
		Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet.getLentType(), null);
		LentHistory result =
				LentHistory.of(now, expirationDate, userId, cabinetId);
		lentRepository.save(result);
		cabinetService.updateStatusByUserCount(cabinetId, 1);
	}

	@Override
	public void endLentCabinet(Long userId) {
		LentHistory lentHistory = returnCabinet(userId);
		userService.banUser(userId, lentHistory.getStartedAt(), lentHistory.getEndedAt());
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		returnCabinet(userId);
	}

	@Override
	public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page,
			Integer length) {
		Validate.inclusiveBetween(0, Integer.MAX_VALUE, page.intValue());
		Validate.inclusiveBetween(1, Integer.MAX_VALUE, length.intValue());
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
		lentExceptionHandler.getCabinet(cabinetId);
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
						lentExceptionHandler.getCabinet(e.getCabinetId()),
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
