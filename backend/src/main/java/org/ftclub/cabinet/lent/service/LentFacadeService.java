package org.ftclub.cabinet.lent.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.service.CabinetCommandService;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.club.service.ClubQueryService;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.dto.UserVerifyRequestDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.BanHistoryCommandService;
import org.ftclub.cabinet.user.service.BanHistoryQueryService;
import org.ftclub.cabinet.user.service.BanPolicyService;
import org.ftclub.cabinet.user.service.LentExtensionCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentFacadeService {

	private final LentRedisService lentRedisService;
	private final LentQueryService lentQueryService;
	private final LentCommandService lentCommandService;
	private final ClubQueryService clubQueryService;
	private final ClubLentCommandService clubLentCommandService;
	private final ClubLentQueryService clubLentQueryService;
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
	private final LentExtensionCommandService lentExtensionCommandService;


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
				.map(lentHistory -> lentMapper.toLentHistoryDto(lentHistory, lentHistory.getUser(),
						lentHistory.getCabinet())).collect(Collectors.toList());
		return lentMapper.toLentHistoryPaginationDto(result, lentHistories.getTotalElements());
	}

	/**
	 * 내 대여 정보 조회
	 *
	 * @param user 사용자 세션
	 * @return 대여 정보
	 */
	@Transactional(readOnly = true)
	public MyCabinetResponseDto getMyLentInfo(UserSessionDto user) {
		LentHistory userLentHistory = lentQueryService.findUserActiveLentHistoryWithCabinet(
				user.getUserId());
		Long cabinetId;
		Cabinet userActiveCabinet;
		List<LentDto> lentDtoList;
		if (userLentHistory == null) {
			cabinetId = lentRedisService.findCabinetJoinedUser(user.getUserId());
			if (cabinetId == null) {
				return null;
			}
			List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinetId);
			List<User> userList = userQueryService.findUsers(usersInCabinet);
			userActiveCabinet = cabinetQueryService.getCabinet(cabinetId);
			lentDtoList = userList.stream().map(u -> lentMapper.toLentDto(u, null))
					.collect(Collectors.toList());
		} else {
			userActiveCabinet = userLentHistory.getCabinet();
			cabinetId = userActiveCabinet.getId();
			List<LentHistory> lentHistories = lentQueryService.findCabinetActiveLentHistories(
					cabinetId);
			lentDtoList = lentHistories.stream().map(lh -> lentMapper.toLentDto(lh.getUser(), lh))
					.collect(Collectors.toList());
		}
		String shareCode = lentRedisService.getShareCode(cabinetId);
		LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);
		String previousUserName = lentRedisService.getPreviousUserName(cabinetId);
		return cabinetMapper.toMyCabinetResponseDto(userActiveCabinet, lentDtoList, shareCode,
				sessionExpiredAt, previousUserName);
	}

	/**
	 * 현재 대여 중인 모든 대여 기록 조회
	 *
	 * @return 대여 기록 {@link List}
	 */
	@Transactional(readOnly = true)
	public List<ActiveLentHistoryDto> getAllActiveLentHistories() {
		LocalDateTime now = LocalDateTime.now();
		List<LentHistory> lentHistories = lentQueryService.findAllActiveLentHistoriesWithCabinetAndUser();
		return lentHistories.stream()
				.map(lh -> lentMapper.toActiveLentHistoryDto(lh, lh.getUser(), lh.getCabinet(),
						lh.isExpired(now), lh.getDaysUntilExpiration(now)))
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
		Cabinet cabinet = cabinetQueryService.getCabinetForUpdate(cabinetId);
		int lentCount = lentQueryService.countUserActiveLent(userId);
		List<BanHistory> banHistories = banHistoryQueryService.findActiveBanHistories(userId, now);
		int userCount = lentQueryService.countCabinetUser(cabinetId);

		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}

		lentPolicyService.verifyCabinetLentCount(cabinet.getLentType(), cabinet.getMaxUser(),
				userCount);
		lentPolicyService.verifyCabinetType(cabinet.getLentType(), LentType.PRIVATE);
		lentPolicyService.verifyUserForLent(
				new UserVerifyRequestDto(user.getBlackholedAt(), lentCount,
						cabinetId, cabinet.getStatus(), banHistories));
//				new UserVerifyRequestDto(user.getRole(), user.getBlackholedAt(), lentCount,
//						cabinetId, cabinet.getStatus(), banHistories));
		lentPolicyService.verifyCabinetForLent(cabinet.getStatus(), cabinet.getLentType());

		LocalDateTime expiredAt = lentPolicyService.generateExpirationDate(now, LentType.PRIVATE,
				1);
		lentCommandService.startLent(user.getId(), cabinet.getId(), now, expiredAt);
		cabinetCommandService.changeStatus(cabinet, CabinetStatus.FULL);
		cabinetCommandService.changeUserCount(cabinet, lentCount + 1);
		eventPublisher.publishEvent(AlarmEvent.of(userId,
				new LentSuccessAlarm(cabinet.getCabinetPlace().getLocation(),
						cabinet.getVisibleNum(), expiredAt)));
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
		Cabinet cabinet = cabinetQueryService.getCabinetForUpdate(cabinetId);
		int userCount = lentQueryService.countCabinetUser(cabinetId);
		lentPolicyService.verifyCabinetLentCount(cabinet.getLentType(), cabinet.getMaxUser(),
				userCount);
		lentPolicyService.verifyCabinetType(cabinet.getLentType(), LentType.SHARE);

		List<BanHistory> banHistories = banHistoryQueryService.findActiveBanHistories(userId, now);
		int lentCount = lentQueryService.countUserActiveLent(userId);
		User user = userQueryService.getUser(userId);
		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}

		lentPolicyService.verifyUserForLent(
				new UserVerifyRequestDto(user.getBlackholedAt(), lentCount,
						cabinetId, cabinet.getStatus(), banHistories));

		Long attemptCount = lentRedisService.getAttemptCountOnShareCabinet(cabinetId, userId);
		lentPolicyService.verifyAttemptCountOnShareCabinet(attemptCount);

		boolean isExist = lentRedisService.isInCabinetSession(cabinetId);
		if (!isExist) {
			lentPolicyService.verifyCabinetForLent(cabinet.getStatus(), cabinet.getLentType());
			shareCode = lentRedisService.createCabinetSession(cabinetId);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.IN_SESSION);
		}
		lentRedisService.attemptJoinCabinet(cabinetId, userId, shareCode);
		if (lentRedisService.isCabinetSessionFull(cabinetId)) {
			List<Long> userIdsInCabinet = lentRedisService.getUsersInCabinet(cabinetId);
			LocalDateTime expiredAt = lentPolicyService.generateExpirationDate(now, LentType.SHARE,
					userIdsInCabinet.size());
			lentCommandService.startLent(userIdsInCabinet, cabinet.getId(), now, expiredAt);
			lentRedisService.clearCabinetSession(cabinetId);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.FULL);
			cabinetCommandService.changeUserCount(cabinet, userIdsInCabinet.size());

			LentSuccessAlarm alarm = new LentSuccessAlarm(cabinet.getCabinetPlace().getLocation(),
					cabinet.getVisibleNum(), expiredAt);
			eventPublisher.publishEvent(AlarmEvent.of(userId, alarm));
		}
	}

	/**
	 * 동아리 사물함 대여 시작
	 *
	 * @param clubId    사용자 ID
	 * @param cabinetId 사물함 ID
	 */
	@Transactional
	public void startLentClubCabinet(Long clubId, Long cabinetId) {
		LocalDateTime now = LocalDateTime.now();
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		Club club = clubQueryService.getClub(clubId);
		int userCount = lentQueryService.countCabinetUser(cabinetId);

		lentPolicyService.verifyCabinetLentCount(cabinet.getLentType(), cabinet.getMaxUser(),
				userCount);
		lentPolicyService.verifyCabinetType(cabinet.getLentType(), LentType.CLUB);
		lentPolicyService.verifyCabinetForClubLent(cabinet.getStatus(), cabinet.getLentType());

		LocalDateTime expiredAt = lentPolicyService.generateExpirationDate(now,
				cabinet.getLentType(), 1);
		clubLentQueryService.findAlreadyExistsClubLentHistory(clubId);
		clubLentCommandService.startLent(clubId, cabinetId, expiredAt);
		cabinetCommandService.updateTitle(cabinet, club.getName());
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
		Cabinet cabinet = cabinetQueryService.getCabinetForUpdate(
				lentHistories.get(0).getCabinetId());

		int userRemainCount = lentHistories.size() - 1;
		cabinetCommandService.changeUserCount(cabinet, userRemainCount);
		lentCommandService.endLent(userLentHistory, now);
		lentRedisService.setPreviousUserName(cabinet.getId(), userLentHistory.getUser().getName());
		cabinetCommandService.updateTitle(cabinet, "");
		cabinetCommandService.updateMemo(cabinet, (memo == null) ? "" : memo);

		LocalDateTime expiredAt = userLentHistory.getExpiredAt();
		BanType banType = banPolicyService.verifyBan(now, expiredAt);
		if (!banType.equals(BanType.NONE)) {
			LocalDateTime unbannedAt = banPolicyService.getUnBannedAt(now, expiredAt);
			banHistoryCommandService.banUser(userId, now, unbannedAt, banType);
		}
		if (cabinet.isLentType(LentType.SHARE)) {
			LocalDateTime newExpiredAt = lentPolicyService.adjustShareCabinetExpirationDate(
					userRemainCount, now, expiredAt);
			List<Long> lentHistoryIds = lentHistories.stream()
					.filter(lh -> !lh.equals(userLentHistory)).map(LentHistory::getId)
					.collect(Collectors.toList());
			lentCommandService.setExpiredAt(lentHistoryIds, newExpiredAt);
		}
	}

	/**
	 * 동아리 사물함 대여 종료
	 *
	 * @param clubId    사용자 ID
	 * @param cabinetId 사물함 ID
	 */
	@Transactional
	public void endLentClub(Long clubId, Long cabinetId, String memo) {
		LocalDateTime now = LocalDateTime.now();
		Cabinet cabinet = cabinetQueryService.getCabinet(cabinetId);
		ClubLentHistory clubLentHistory =
				clubLentQueryService.getClubActiveLentHistory(clubId, cabinetId);
		lentPolicyService.verifyCabinetType(cabinet.getLentType(), LentType.CLUB);

		clubLentCommandService.endLent(clubLentHistory, now);
		cabinetCommandService.changeUserCount(cabinet, 0);
		cabinetCommandService.changeStatus(cabinet, CabinetStatus.AVAILABLE);
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
		lentRedisService.deleteUserInCabinet(cabinetId, userId);
		if (!lentRedisService.isInCabinetSession(cabinetId)) {
			Cabinet cabinet = cabinetQueryService.getCabinetForUpdate(cabinetId);
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
		Cabinet cabinet = cabinetQueryService.getCabinetForUpdate(cabinetId);
		List<Long> usersInCabinetSession = lentRedisService.getUsersInCabinet(cabinetId);
		if (lentPolicyService.checkUserCountOnShareCabinet(usersInCabinetSession.size())) {
			LocalDateTime now = LocalDateTime.now();
			LocalDateTime expiredAt = lentPolicyService.generateExpirationDate(now, LentType.SHARE,
					usersInCabinetSession.size());
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.FULL);
			lentCommandService.startLent(usersInCabinetSession, cabinetId, now, expiredAt);
		} else {
			lentRedisService.clearCabinetSession(cabinetId);
			cabinetCommandService.changeStatus(cabinet, CabinetStatus.AVAILABLE);
		}
		lentRedisService.confirmCabinetSession(cabinetId, usersInCabinetSession);
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
	 * 개인 사물함을 스왑합니다.
	 * <p>
	 * 만료까지 1일 이상이 남은 개인 사물함을 대여 중인 사용자가 다른 사용가능한 개인 사물함을 대여할 수 있습니다.
	 *
	 * @param userId       스왑하려는 사용자 ID
	 * @param newCabinetId 스왑하고자 하는 사물함 ID
	 */
	@Transactional
	public void swapPrivateCabinet(Long userId, Long newCabinetId) {
		LocalDateTime now = LocalDateTime.now();
		LentHistory oldLentHistory = lentQueryService.getUserActiveLentHistoryWithCabinet(userId);
		Cabinet oldCabinet = cabinetQueryService.getCabinetForUpdate(oldLentHistory.getCabinetId());
		lentPolicyService.verifySelfSwap(oldCabinet.getId(), newCabinetId);
		Cabinet newCabinet = cabinetQueryService.getCabinetForUpdate(newCabinetId);

		lentPolicyService.verifyCabinetType(oldCabinet.getLentType(), LentType.PRIVATE);
		lentPolicyService.verifyCabinetType(newCabinet.getLentType(), LentType.PRIVATE);
		lentPolicyService.verifyCabinetForLent(newCabinet.getStatus(), newCabinet.getLentType());

		int newCabinetLentUserCount = lentQueryService.countCabinetUser(newCabinetId);
		lentPolicyService.verifySwapPrivateCabinet(oldLentHistory.getExpiredAt(), now,
				newCabinetLentUserCount);
		lentCommandService.startLent(userId, newCabinetId, now, oldLentHistory.getExpiredAt());
		cabinetCommandService.changeStatus(newCabinet, CabinetStatus.FULL);
		cabinetCommandService.changeUserCount(newCabinet, newCabinetLentUserCount + 1);
		cabinetCommandService.updateTitle(newCabinet, oldCabinet.getTitle());
		cabinetCommandService.updateMemo(newCabinet, oldCabinet.getMemo());

		lentCommandService.endLent(oldLentHistory, now);
		cabinetCommandService.changeStatus(oldCabinet, CabinetStatus.PENDING);
		lentRedisService.setPreviousUserName(oldCabinet.getId(),
				oldLentHistory.getUser().getName());
		cabinetCommandService.changeUserCount(oldCabinet, 0);
		cabinetCommandService.updateTitle(oldCabinet, "");
		cabinetCommandService.updateMemo(oldCabinet, "");
	}

	/**
	 * 아이템 사용 로직
	 * <p>
	 * 연체중이지 않고, 대여중인 상태라면 일자만큼 연장 수치를 늘려줍니다.
	 * <p>
	 * 살 때 발급시키고 쓸 때 사용하는게 맞나, 쓸 때 바로 발급시키고 사용하는게 맞나..
	 *
	 * @param userId
	 * @param days
	 */
	@Transactional
	public void plusExtensionDays(Long userId, Integer days) {
		Cabinet cabinet = cabinetQueryService.getUserActiveCabinet(userId);

		LentExtension lentExtensionByItem = lentExtensionCommandService.createLentExtensionByItem(
				userId, LentExtensionType.ALL, days);
		List<LentHistory> lentHistories = lentQueryService.findCabinetActiveLentHistories(
				cabinet.getId());
		lentExtensionCommandService.useLentExtension(lentExtensionByItem, lentHistories);
	}
}
