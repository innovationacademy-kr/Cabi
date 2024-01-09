package org.ftclub.cabinet.lent.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.service.CabinetCommandService;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserSession;
import org.ftclub.cabinet.user.service.BanHistoryCommandService;
import org.ftclub.cabinet.user.service.BanHistoryQueryService;
import org.ftclub.cabinet.user.service.BanPolicyService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.ftclub.cabinet.cabinet.domain.LentType.PRIVATE;
import static org.ftclub.cabinet.cabinet.domain.LentType.SHARE;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentFacadeService {

	private final LentRedisService lentRedisService;
	private final LentQueryService lentQueryService;
	private final LentCommandService lentCommandService;
	private final UserQueryService userQueryService;
	private final CabinetQueryService cabinetQueryService;
	private final CabinetCommandService cabinetCommandService;
	private final BanHistoryQueryService banHistoryQueryService;
	private final BanHistoryCommandService banHistoryCommandService;

	private final LentPolicyService lentPolicyService;
	private final BanPolicyService banPolicyService;
	private final ApplicationEventPublisher eventPublisher;

	private final LentMapper lentMapper;
	private final CabinetMapper cabinetMapper;


	/**
	 * 내 대여 기록 조회
	 *
	 * @param user     사용자 세션
	 * @param pageable 페이지 정보
	 * @return 대여 기록
	 */
	@Transactional(readOnly = true)
	public LentHistoryPaginationDto getMyLentLog(UserSessionDto user, Pageable pageable) {
		Page<LentHistory> lentHistories =
				lentQueryService.findUserLentHistories(user.getUserId(), pageable);
		List<LentHistoryDto> result = lentHistories.stream()
				.sorted(Comparator.comparing(LentHistory::getStartedAt).reversed())
				.map(lentHistory -> lentMapper.toLentHistoryDto(
						lentHistory,
						lentHistory.getUser(),
						lentHistory.getCabinet()))
				.collect(Collectors.toList());
		return lentMapper.toLentHistoryPaginationDto(result, lentHistories.getTotalElements());
	}

	/**
	 * 내 대여 정보 조회
	 *
	 * @param user 사용자 세션
	 * @return 대여 정보
	 */
	@Transactional(readOnly = true)
	public MyCabinetResponseDto getMyLentInfo(@UserSession UserSessionDto user) {
		LentHistory userLentHistory =
				lentQueryService.findUserActiveLentHistoryAndCabinet(user.getUserId());
		Long cabinetId;
		Cabinet userActiveCabinet;
		List<LentDto> lentDtoList;
		if (userLentHistory == null) {
			cabinetId = lentRedisService.findCabinetJoinedUser(user.getUserId());
			if (Objects.isNull(cabinetId)) {
				return null;
			}
			List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinetId);
			List<User> userList = userQueryService.getUsers(usersInCabinet);
			userActiveCabinet = cabinetQueryService.findCabinet(cabinetId);
			lentDtoList = userList.stream()
					.map(u -> lentMapper.toLentDto(u, null)).collect(Collectors.toList());
		} else {
			userActiveCabinet = userLentHistory.getCabinet();
			cabinetId = userActiveCabinet.getId();
			List<LentHistory> lentHistories =
					lentQueryService.findCabinetActiveLentHistories(cabinetId);
			lentDtoList = lentHistories.stream()
					.map(lh -> lentMapper.toLentDto(lh.getUser(), lh)).collect(Collectors.toList());
		}
		String shareCode = lentRedisService.getShareCode(cabinetId);
		LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);
		String previousUserName = lentRedisService.getPreviousUserName(cabinetId);
		return cabinetMapper.toMyCabinetResponseDto(userActiveCabinet, lentDtoList,
				shareCode, sessionExpiredAt, previousUserName);
	}

	/**
	 * 현재 대여 중인 모든 대여 기록 조회
	 *
	 * @return 대여 기록 {@link List}
	 */
	@Transactional(readOnly = true)
	public List<ActiveLentHistoryDto> getAllActiveLentHistories() {
		LocalDateTime now = LocalDateTime.now();
		List<LentHistory> lentHistories =
				lentQueryService.findAllActiveLentHistoriesWithCabinetAndUser();
		return lentHistories.stream()
				.map(lh -> lentMapper.toActiveLentHistoryDto(lh,
						lh.getUser(),
						lh.getCabinet(),
						lh.isExpired(now),
						lh.getDaysUntilExpiration(now)))
				.collect(Collectors.toList());
	}

	/*------------------------------------------  CUD  -------------------------------------------*/

	/**
	 * 개인 사물함 대여 시작
	 *
	 * @param userId    사용자 ID
	 * @param cabinetId 사물함 ID
	 */
	@Transactional
	public void startLentCabinet(Long userId, Long cabinetId) {
		LocalDateTime now = LocalDateTime.now();
		User user = userQueryService.getUser(userId);
		Cabinet cabinet = cabinetQueryService.findCabinetsForUpdate(cabinetId);
		int lentCount = lentQueryService.countUserActiveLent(userId);
		List<BanHistory> banHistories = banHistoryQueryService.findActiveBanHistories(userId, now);
		int userCount = lentQueryService.countCabinetUser(cabinetId);

		lentPolicyService.verifyCabinetLentCount(
				cabinet.getLentType(), cabinet.getMaxUser(), userCount);
		lentPolicyService.verifyCabinetType(cabinet.getLentType(), PRIVATE);
		lentPolicyService.verifyUserForLent(new UserVerifyRequestDto(user.getRole(),
				user.getBlackholedAt(), lentCount, cabinetId, cabinet.getStatus(), banHistories));
		lentPolicyService.verifyCabinetForLent(cabinet.getStatus(), cabinet.getLentType());

		LocalDateTime expiredAt = lentPolicyService.generateExpirationDate(now, PRIVATE, 1);
		lentCommandService.startLent(user.getId(), cabinet.getId(), now, expiredAt);
		cabinetCommandService.changeStatus(cabinet, CabinetStatus.FULL);
		cabinetCommandService.changeUserCount(cabinet, lentCount + 1);
		eventPublisher.publishEvent(AlarmEvent.of(userId, new LentSuccessAlarm(
				cabinet.getCabinetPlace().getLocation(), cabinet.getVisibleNum(), expiredAt)));
	}

	/**
	 * 공유 사물함 대여 시작
	 *
	 * @param userId    사용자 ID
	 * @param cabinetId 사물함 ID
	 * @param shareCode 공유 코드
	 */
	@Transactional
	public void startLentShareCabinet(Long userId, Long cabinetId, String shareCode) {
		LocalDateTime now = LocalDateTime.now();
		Cabinet cabinet = cabinetQueryService.findCabinetsForUpdate(cabinetId);
		int userCount = lentQueryService.countCabinetUser(cabinetId);
		lentPolicyService.verifyCabinetLentCount(
				cabinet.getLentType(), cabinet.getMaxUser(), userCount);
		lentPolicyService.verifyCabinetType(cabinet.getLentType(), SHARE);

		List<BanHistory> banHistories = banHistoryQueryService.findActiveBanHistories(userId, now);
		int lentCount = lentQueryService.countUserActiveLent(userId);
		User user = userQueryService.getUser(userId);
		lentPolicyService.verifyUserForLent(new UserVerifyRequestDto(user.getRole(),
				user.getBlackholedAt(), lentCount, cabinetId, cabinet.getStatus(), banHistories));

		Long attemptCount = lentRedisService.getAttemptCountOnShareCabinet(cabinetId, userId);
		lentPolicyService.verifyAttemptCountOnShareCabinet(attemptCount);

		boolean isExist = lentRedisService.isInCabinetSession(cabinetId);
		if (!isExist) {
			lentPolicyService.verifyCabinetForLent(cabinet.getStatus(), cabinet.getLentType());
			shareCode = lentRedisService.createCabinetSession(cabinetId);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.IN_SESSION);
		}
		lentRedisService.joinCabinetSession(cabinetId, userId, shareCode);
		if (lentRedisService.isCabinetSessionFull(cabinetId)) {
			List<Long> userIdsInCabinet = lentRedisService.getUsersInCabinetSession(cabinetId);
			LocalDateTime expiredAt =
					lentPolicyService.generateExpirationDate(now, SHARE, userIdsInCabinet.size());
			lentCommandService.startLent(userIdsInCabinet, cabinet.getId(), now, expiredAt);
			lentRedisService.clearCabinetSession(cabinetId);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.FULL);
			cabinetCommandService.changeUserCount(cabinet, userIdsInCabinet.size());

			LentSuccessAlarm alarm = new LentSuccessAlarm(
					cabinet.getCabinetPlace().getLocation(), cabinet.getVisibleNum(), expiredAt);
			eventPublisher.publishEvent(AlarmEvent.of(userId, alarm));
		}
	}

	/**
	 * 동아리 사물함 대여 시작
	 *
	 * @param userId    사용자 ID
	 * @param cabinetId 사물함 ID
	 */
	@Transactional
	public void startLentClubCabinet(Long userId, Long cabinetId) {
		LocalDateTime now = LocalDateTime.now();
		// TODO : userId로 ClubUser 검증 로직 필요(Policy)
		Cabinet cabinet = cabinetQueryService.findCabinet(cabinetId);
		int userCount = lentQueryService.countCabinetUser(cabinetId);

		lentPolicyService.verifyCabinetLentCount(
				cabinet.getLentType(), cabinet.getMaxUser(), userCount);
		lentPolicyService.verifyCabinetType(cabinet.getLentType(), LentType.CLUB);
		lentPolicyService.verifyCabinetForLent(cabinet.getStatus(), cabinet.getLentType());
		LocalDateTime expiredAt =
				lentPolicyService.generateExpirationDate(now, cabinet.getLentType(), 1);
		lentCommandService.startLent(userId, cabinetId, now, expiredAt);
		cabinetCommandService.changeUserCount(cabinet, userCount + 1);
	}

	/**
	 * 개인 사물함 대여 종료
	 * <p>
	 * 대여 종료 시 메모를 입력할 수 있습니다.
	 *
	 * @param userId 사용자 ID
	 * @param memo   메모
	 */
	@Transactional
	public void endUserLent(Long userId, String memo) {
		LocalDateTime now = LocalDateTime.now();
		List<LentHistory> lentHistories =
				lentQueryService.findUserActiveLentHistoriesInCabinetForUpdate(userId);
		if (lentHistories.isEmpty()) {
			throw ExceptionStatus.NOT_FOUND_LENT_HISTORY.asServiceException();
		}
		LentHistory userLentHistory = lentHistories.stream()
				.filter(lh -> lh.getUserId().equals(userId)).findFirst()
				.orElseThrow(ExceptionStatus.NOT_FOUND_LENT_HISTORY::asServiceException);
		Cabinet cabinet =
				cabinetQueryService.findCabinetsForUpdate(lentHistories.get(0).getCabinetId());

		int userRemainCount = lentHistories.size() - 1;
		cabinetCommandService.changeUserCount(cabinet, userRemainCount);
		lentCommandService.endLent(userLentHistory, now);
		lentRedisService.setPreviousUserName(
				cabinet.getId(), userLentHistory.getUser().getName());
		if (memo != null) {
			cabinetCommandService.updateMemo(cabinet, memo);
		}

		LocalDateTime expiredAt = userLentHistory.getExpiredAt();
		BanType banType = banPolicyService.verifyBan(now, expiredAt);
		if (!banType.equals(BanType.NONE)) {
			LocalDateTime unbannedAt = banPolicyService.getUnBannedAt(now, expiredAt);
			banHistoryCommandService.banUser(userId, now, unbannedAt, banType);
		}
		if (cabinet.isLentType(SHARE)) {
			LocalDateTime newExpiredAt = lentPolicyService.adjustShareCabinetExpirationDate(
					userRemainCount, now, expiredAt);
			List<Long> lentHistoryIds = lentHistories.stream()
					.filter(lh -> !lh.equals(userLentHistory))
					.map(LentHistory::getId).collect(Collectors.toList());
			lentCommandService.setExpiredAt(lentHistoryIds, newExpiredAt);
		}
	}

	/**
	 * 사물함 정보 수정
	 * <p>
	 * 사물함 제목과 메모를 수정할 수 있습니다.
	 *
	 * @param userId 사용자 ID
	 * @param title  사물함 제목
	 * @param memo   사물함 메모
	 */
	@Transactional
	public void updateLentCabinetInfo(Long userId, String title, String memo) {
		Cabinet cabinet = cabinetQueryService.getUserActiveCabinetForUpdate(userId);
		cabinetCommandService.updateTitle(cabinet, title);
		cabinetCommandService.updateMemo(cabinet, memo);
	}

	/**
	 * 공유 사물함 대여 취소
	 *
	 * @param userId    사용자 ID
	 * @param cabinetId 사물함 ID
	 */
	@Transactional
	public void cancelShareCabinetLent(Long userId, Long cabinetId) {
		lentRedisService.deleteUserInCabinetSession(cabinetId, userId);
		if (lentRedisService.isCabinetSessionEmpty(cabinetId)) {
			Cabinet cabinet = cabinetQueryService.findCabinetsForUpdate(cabinetId);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.AVAILABLE);
		}
	}

	/**
	 * 공유 사물함 대여 세션 만료
	 *
	 * @param cabinetId 사물함 ID
	 */
	@Transactional
	public void shareCabinetSessionExpired(Long cabinetId) {
		Cabinet cabinet = cabinetQueryService.findCabinetsForUpdate(cabinetId);
		List<Long> usersInCabinetSession = lentRedisService.getUsersInCabinetSession(cabinetId);
		if (lentPolicyService.checkUserCountOnShareCabinet(usersInCabinetSession.size())) {
			LocalDateTime now = LocalDateTime.now();
			LocalDateTime expiredAt = lentPolicyService.generateExpirationDate(
					now, SHARE, usersInCabinetSession.size());
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.FULL);
			lentCommandService.startLent(usersInCabinetSession, cabinetId, now, expiredAt);
		} else {
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.AVAILABLE);
		}
		lentRedisService.confirmCabinetSession(cabinetId, usersInCabinetSession);
	}
}
