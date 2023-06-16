package org.ftclub.cabinet.lent.service;

import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
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
	private final CabinetOptionalFetcher cabinetExceptionHandler;
	private final UserOptionalFetcher userExceptionHandler;
	private final UserService userService;
	private final CabinetService cabinetService;
	private final BanHistoryRepository banHistoryRepository;

	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		Date now = new Date();
		Cabinet cabinet = cabinetExceptionHandler.getCabinetForUpdate(cabinetId);
		User user = userExceptionHandler.getUser(userId);
		int userActiveLentCount = lentRepository.countUserActiveLent(userId);
		List<BanHistory> userActiveBanList = banHistoryRepository.findUserActiveBanList(userId,
				DateUtil.getNow());
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
		Date expiredAt = lentPolicy.generateExpirationDate(now, cabinet,
				cabinetActiveLentHistories);
		LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
		// 연체 시간 적용
		lentPolicy.applyExpirationDate(lentHistory, cabinetActiveLentHistories, expiredAt);
		lentRepository.save(lentHistory);
	}

	@Override
	public void startLentClubCabinet(Long userId, Long cabinetId) {
		Date now = new Date();
		Cabinet cabinet = cabinetExceptionHandler.getClubCabinet(cabinetId);
		userExceptionHandler.getClubUser(userId);
		lentExceptionHandler.checkExistedSpace(cabinetId);
		Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet, null);
		LentHistory result =
				LentHistory.of(now, expirationDate, userId, cabinetId);
		lentRepository.save(result);
		cabinet.specifyStatusByUserCount(1);
	}

	@Override
	public void endLentCabinet(Long userId) {
		LentHistory lentHistory = returnCabinet(userId);
		Cabinet cabinet = cabinetExceptionHandler.getCabinetForUpdate(lentHistory.getCabinetId());
		// cabinetType도 인자로 전달하면 좋을 거 같습니다 (공유사물함 3일이내 반납 페널티)
		userService.banUser(userId, cabinet.getLentType(), lentHistory.getStartedAt(),
				lentHistory.getEndedAt(), lentHistory.getExpiredAt());
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		returnCabinet(userId);
	}

	@Override
	public void terminateLentByCabinetId(Long cabinetId) {
		returnCabinetByCabinetId(cabinetId);
	}

	private LentHistory returnCabinetByCabinetId(Long cabinetId) {
		Date now = new Date();
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(cabinetId);
		LentHistory lentHistory = lentExceptionHandler.getActiveLentHistoryWithCabinetId(cabinetId);
		int activeLentCount = lentRepository.countCabinetActiveLent(lentHistory.getCabinetId());
		lentHistory.endLent(now);
		cabinet.specifyStatusByUserCount(activeLentCount - 1);
		return lentHistory;
	}

	private LentHistory returnCabinet(Long userId) {
		Date now = new Date();
		userExceptionHandler.getUser(userId);
		LentHistory lentHistory = lentExceptionHandler.getActiveLentHistoryWithUserId(userId);
		Cabinet cabinet = cabinetExceptionHandler.getCabinetForUpdate(lentHistory.getCabinetId());
		int activeLentCount = lentRepository.countCabinetActiveLent(lentHistory.getCabinetId());
		lentHistory.endLent(now);
		cabinet.specifyStatusByUserCount(activeLentCount - 1);
		return lentHistory;
	}

	@Override
	public void assignLent(Long userId, Long cabinetId) {
		Date now = DateUtil.getNow();
		userExceptionHandler.getUser(userId);
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(cabinetId);
		lentExceptionHandler.checkExistedSpace(cabinetId);
		Date expirationDate = lentPolicy.generateExpirationDate(now, cabinet, null);
		LentHistory result = LentHistory.of(now, expirationDate, userId, cabinetId);
		cabinet.specifyStatusByUserCount(1);
		lentRepository.save(result);
	}
}