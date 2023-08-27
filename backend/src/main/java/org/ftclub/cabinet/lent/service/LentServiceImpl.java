package org.ftclub.cabinet.lent.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.redis.TicketingSharedCabinet;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class LentServiceImpl implements LentService {

	private final LentRepository lentRepository;
	private final LentPolicy lentPolicy;
	private final LentOptionalFetcher lentOptionalFetcher;
	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final UserOptionalFetcher userExceptionHandler;
	private final UserService userService;
	private final BanHistoryRepository banHistoryRepository;
	private final LentMapper lentMapper;
	private final TicketingSharedCabinet ticketingSharedCabinet;
	private final CabinetProperties cabinetProperties;

	@Override
	public void startLentCabinet(Long userId, Long cabinetId) {
		log.info("Called startLentCabinet: {}, {}", userId, cabinetId);
		LocalDateTime now = LocalDateTime.now();
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(cabinetId);
		User user = userExceptionHandler.getUser(userId);
		int userActiveLentCount = lentRepository.countUserActiveLent(userId);
		List<BanHistory> userActiveBanList = banHistoryRepository.findUserActiveBanList(userId,
				now);
		// 대여 가능한 유저인지 확인
		lentPolicy.handlePolicyStatus(
				lentPolicy.verifyUserForLent(user, cabinet, userActiveLentCount, userActiveBanList),
				userActiveBanList);
		// 대여 가능한 캐비넷인지 확인
		lentPolicy.handlePolicyStatus(lentPolicy.verifyCabinetForLent(cabinet), userActiveBanList);
		// 캐비넷 상태 변경
		cabinet.specifyStatus(CabinetStatus.FULL);
		// 만료 시간 적용
		LocalDateTime expiredAt = lentPolicy.generateExpirationDate(now, cabinet);
		LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
		lentPolicy.applyExpirationDate(lentHistory, expiredAt);
		lentRepository.save(lentHistory);
	}

	@Override
	public void startLentShareCabinet(Long userId, Long cabinetId, Integer shareCode) {
		log.info("Called startLentShareCabinet: {}, {}", userId, cabinetId);
		LocalDateTime now = LocalDateTime.now();
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(cabinetId);
		User user = userExceptionHandler.getUser(userId);
		int userActiveLentCount = lentRepository.countUserActiveLent(userId);
		List<BanHistory> userActiveBanList = banHistoryRepository.findUserActiveBanList(userId,
				now);
		// 대여 가능한 유저인지 확인
		lentPolicy.handlePolicyStatus(
				lentPolicy.verifyUserForLentShare(user, cabinet, userActiveLentCount,
						userActiveBanList), userActiveBanList);
		boolean hasShadowKey = ticketingSharedCabinet.isShadowKey(cabinetId);
		if (!hasShadowKey) {// 최초 대여인 경우
			lentPolicy.handlePolicyStatus(lentPolicy.verifyCabinetForLent(cabinet),
					userActiveBanList);
			cabinet.specifyStatus(CabinetStatus.IN_SESSION);
			ticketingSharedCabinet.setShadowKey(cabinetId);
		}
		ticketingSharedCabinet.saveValue(cabinetId, userId, shareCode, hasShadowKey);
		// 4번째 (마지막) 대여자인 경우
		if (Objects.equals(ticketingSharedCabinet.getSizeOfUsers(cabinetId),
				cabinetProperties.getShareMaxUserCount())) {
			cabinet.specifyStatus(CabinetStatus.FULL);
			saveLentHistories(now, cabinetId);
			// cabinetId에 대한 shadowKey, valueKey 삭제
			ticketingSharedCabinet.deleteShadowKey(cabinetId);
			ticketingSharedCabinet.deleteValueKey(cabinetId);
		}
	}

	@Override
	public void startLentClubCabinet(Long userId, Long cabinetId) {
		log.debug("Called startLentClubCabinet: {}, {}", userId, cabinetId);
		Cabinet cabinet = cabinetOptionalFetcher.getClubCabinet(cabinetId);
		lentOptionalFetcher.checkExistedSpace(cabinetId);
		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(LocalDateTime.now(),
				cabinet);
		LentHistory result =
				LentHistory.of(LocalDateTime.now(), expirationDate, userId, cabinetId);
		lentRepository.save(result);
		cabinet.specifyStatusByUserCount(1); // todo : policy에서 관리
	}

	@Override
	public void endLentCabinet(Long userId) {
		log.debug("Called endLentCabinet: {}", userId);
		LentHistory lentHistory = returnCabinetByUserId(userId);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(lentHistory.getCabinetId());
		// cabinetType도 인자로 전달하면 좋을 거 같습니다 (공유사물함 3일이내 반납 페널티)
		userService.banUser(userId, cabinet.getLentType(), lentHistory.getStartedAt(),
				lentHistory.getEndedAt(), lentHistory.getExpiredAt());
	}

	@Override
	public void terminateLentCabinet(Long userId) {
		log.debug("Called terminateLentCabinet: {}", userId);
		returnCabinetByUserId(userId);
	}

	@Override
	public void terminateLentByCabinetId(Long cabinetId) {
		log.debug("Called terminateLentByCabinetId: {}", cabinetId);
		returnCabinetByCabinetId(cabinetId);
	}

	@Override
	public void cancelLentShareCabinet(Long userId) {
		log.debug("Called cancelLentShareCabinet: {}", userId);
		// TODO: redis key 값 삭제
	}

	// cabinetId로 return하는 경우에서, 공유 사물함과 개인 사물함의 경우에 대한 분기가 되어 있지 않음.
	// 또한 어드민의 경우에서 사용하는 returnByCabinetId와 유저가 사용하는 returnByCabinetId가 다른 상황이므로
	// (어드민의 경우에는 뭐든지 전체 반납, 유저가 사용하는 경우에는 본인이 사용하는 사물함에 대한 반납)
	// 유저가 사용하는 경우에 대해서는 userId로만 쓰게하든, 한 방식으로만 사용하게끔 해야함 - 함수를 쪼갤 가능성도 있음.
	// 우선 현재 관리자만 쓰고 있고, 한 군데에서만 사용되므로 List로 전체 반납을 하도록 구현, 이에 대한 논의는 TO-DO
	private List<LentHistory> returnCabinetByCabinetId(Long cabinetId) {
		log.debug("Called returnCabinetByCabinetId: {}", cabinetId);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(cabinetId);
		List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentByCabinetId(
				cabinetId);
		lentHistories.forEach(lentHistory -> lentHistory.endLent(LocalDateTime.now()));
		cabinet.specifyStatusByUserCount(0); // policy로 빼는게..?
		cabinet.writeMemo("");
		cabinet.writeTitle("");
		return lentHistories;
	}

	private LentHistory returnCabinetByUserId(Long userId) {
		log.debug("Called returnCabinet: {}", userId);
		userExceptionHandler.getUser(userId);
		LentHistory lentHistory = lentOptionalFetcher.getActiveLentHistoryWithUserId(userId);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(lentHistory.getCabinetId());
		int activeLentCount = lentRepository.countCabinetActiveLent(lentHistory.getCabinetId());
		lentHistory.endLent(LocalDateTime.now());
		cabinet.specifyStatusByUserCount(activeLentCount - 1); // policy로 빠질만한 부분인듯?
		if (activeLentCount - 1 == 0) {
			cabinet.writeMemo("");
			cabinet.writeTitle("");
		}
		return lentHistory;
	}

	@Override
	public void assignLent(Long userId, Long cabinetId) {
		log.debug("Called assignLent: {}, {}", userId, cabinetId);
		userExceptionHandler.getUser(userId);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(cabinetId);
		lentOptionalFetcher.checkExistedSpace(cabinetId);
		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(LocalDateTime.now(),
				cabinet);
		LentHistory result = LentHistory.of(LocalDateTime.now(), expirationDate, userId, cabinetId);
		cabinet.specifyStatusByUserCount(1);
		lentRepository.save(result);
	}

	@Override
	public List<ActiveLentHistoryDto> getAllActiveLentHistories() {
		log.debug("Called getAllActiveLentHistories");
		List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentHistories();
		LocalDateTime now = LocalDateTime.now();
		return lentHistories.stream()
				.map(e -> lentMapper.toActiveLentHistoryDto(e,
						e.getUser(),
						e.getCabinet(),
						e.isExpired(now),
						e.getDaysUntilExpiration(now)
				))
				.collect(Collectors.toList());
	}

	public void saveLentHistories(LocalDateTime now, Long cabinetId) {
		ArrayList<Long> userIdList = ticketingSharedCabinet.getUserIdList(cabinetId);
		LocalDateTime expiredAt = lentPolicy.generateSharedCabinetExpirationDate(now,
				userIdList.size());

		// userId 반복문 돌면서 수행
		userIdList.stream().map(userId -> LentHistory.of(now, expiredAt, userId, cabinetId))
				.forEach(lentHistory -> {
					lentPolicy.applyExpirationDate(lentHistory, expiredAt);
					lentRepository.save(lentHistory);
				});
	}
}
