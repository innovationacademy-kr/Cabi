package org.ftclub.cabinet.lent.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentRepository;
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

	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		validateAllId(userId, cabinetId);
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
		validateAllId(userId, cabinetId);
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
		validateAllId(userId);
		LentHistory lentHistory = returnCabinet(userId);
		userService.banUser(userId, lentHistory.getStartedAt(), lentHistory.getEndedAt());
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		validateAllId(userId);
		returnCabinet(userId);
	}

	@Override
	public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page,
			Integer length) {
		validateAllId(userId);
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
		validateAllId(cabinetId);
		PageRequest pageable = PageRequest.of(page, length, Sort.by("STARTED_AT"));
		List<LentHistory> lentHistories = lentRepository.findByCabinetId(cabinetId, pageable);
		int totalLength = lentRepository.countCabinetAllLent(cabinetId);
		return generateLentHistoryPaginationDto(lentHistories, totalLength);
	}

	private LentHistoryPaginationDto generateLentHistoryPaginationDto(
			List<LentHistory> lentHistories, int totalLength) {
		List<LentHistoryDto> lentHistoryDto = lentHistories.stream()
				.map(e -> {
					Cabinet cabinet = lentExceptionHandler.getCabinet(e.getCabinetId());
					User user = lentExceptionHandler.getUser(e.getUserId());
					return new LentHistoryDto(e.getUserId(), user.getName(),
							e.getCabinetId(), cabinet.getVisibleNum(),
							cabinet.getCabinetPlace().getLocation(),
							e.getStartedAt(), e.getEndedAt());
				})
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

	private void validateAllId(Long... id) {
		for (Long i : id) {
			Validate.inclusiveBetween(1, Long.MAX_VALUE, i);
		}
	}
}
