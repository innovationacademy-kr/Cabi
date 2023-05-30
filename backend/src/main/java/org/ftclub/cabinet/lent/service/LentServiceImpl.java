package org.ftclub.cabinet.lent.service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetExceptionHandlerService;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.service.UserExceptionHandlerService;
import org.ftclub.cabinet.user.service.UserService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class LentServiceImpl implements LentService {

	private final LentRepository lentRepository;
	private final LentPolicy lentPolicy;
	private final LentExceptionHandlerService lentExceptionHandler;
	private final CabinetExceptionHandlerService cabinetExceptionHandler;
	private final UserExceptionHandlerService userExceptionHandler;
	private final UserService userService;
	private final CabinetService cabinetService;
	private final BanHistoryRepository banHistoryRepository;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		Date now = DateUtil.getNow();
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(cabinetId);
		User user = userExceptionHandler.getUser(userId);
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
		cabinet.increaseUserCountAndChangeStatus();
		Date expiredAt = lentPolicy.generateExpirationDate(now, cabinet,
				cabinetActiveLentHistories);
		LentHistory lentHistory = LentHistory.of(now, userId, cabinetId);
		// 연체 시간 적용
		lentPolicy.applyExpirationDate(lentHistory, cabinetActiveLentHistories, expiredAt);
		lentRepository.save(lentHistory);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void startLentClubCabinet(Long userId, Long cabinetId) {
		Date now = DateUtil.getNow();
		Cabinet cabinet = cabinetExceptionHandler.getClubCabinet(cabinetId);
		userExceptionHandler.getClubUser(userId);
		lentExceptionHandler.checkExistedSpace(cabinetId);
		Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet,
				Collections.emptyList());
		LentHistory result =
				LentHistory.of(now, expirationDate, userId, cabinetId);
		lentRepository.save(result);
		cabinet.increaseUserCountAndChangeStatus();
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void endLentCabinet(Long userId) {
		LentHistory lentHistory = returnCabinet(userId);
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(lentHistory.getCabinetId());
		userService.banUser(userId, cabinet.getLentType(), lentHistory.getStartedAt(),
				lentHistory.getEndedAt(), lentHistory.getExpiredAt());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void terminateLentCabinet(Long userId) {
		returnCabinet(userId);
	}

	/**
	 * {@inheritDoc}
	 */
	private LentHistory returnCabinet(Long userId) {
		Date now = DateUtil.getNow();
		userExceptionHandler.getUser(userId);
		LentHistory lentHistory = lentExceptionHandler.getActiveLentHistoryWithUserId(userId);
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(lentHistory.getCabinetId());
		lentHistory.endLent(now);
		cabinet.decreaseUserCountAndChangeStatus();
		return lentHistory;
	}
}
