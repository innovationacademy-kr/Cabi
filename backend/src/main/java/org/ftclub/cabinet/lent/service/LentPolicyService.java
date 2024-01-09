package org.ftclub.cabinet.lent.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.dto.UserVerifyRequestDto;
import org.ftclub.cabinet.exception.CustomExceptionStatus;
import org.ftclub.cabinet.exception.CustomServiceException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentPolicyStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentPolicyService {

	private final CabinetProperties cabinetProperties;


	/**
	 * 대여 정책에 따라 예외를 발생시킵니다.
	 *
	 * @param status     대여 정책 상태
	 * @param unbannedAt 밴 해제 시간
	 */
	private void handlePolicyStatus(LentPolicyStatus status, LocalDateTime unbannedAt) {
		String unbannedAtString = null;
		switch (status) {
			case FINE:
				break;
			case BROKEN_CABINET:
				throw new ServiceException(ExceptionStatus.LENT_BROKEN);
			case FULL_CABINET:
				throw new ServiceException(ExceptionStatus.LENT_FULL);
			case OVERDUE_CABINET:
				throw new ServiceException(ExceptionStatus.LENT_EXPIRED);
			case LENT_CLUB:
				throw new ServiceException(ExceptionStatus.LENT_CLUB);
			case IMMINENT_EXPIRATION:
				throw new ServiceException(ExceptionStatus.LENT_EXPIRE_IMMINENT);
			case ALREADY_LENT_USER:
				throw new ServiceException(ExceptionStatus.LENT_ALREADY_EXISTED);
			case ALL_BANNED_USER:
				unbannedAtString = unbannedAt.format(
						DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
				throw new CustomServiceException(
						new CustomExceptionStatus(ExceptionStatus.ALL_BANNED_USER,
								unbannedAtString));
			case SHARE_BANNED_USER:
				unbannedAtString = unbannedAt.format(
						DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
				throw new CustomServiceException(
						new CustomExceptionStatus(ExceptionStatus.SHARE_CODE_TRIAL_EXCEEDED,
								unbannedAtString));
			case BLACKHOLED_USER:
				throw new ServiceException(ExceptionStatus.BLACKHOLED_USER);
			case PENDING_CABINET:
				throw new ServiceException(ExceptionStatus.LENT_PENDING);
			case NOT_USER:
			case INTERNAL_ERROR:
			default:
				throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 해당 유저가 대여를 해도 되는 상태인지 확인합니다.
	 *
	 * @param requestDto 대여 요청 정보
	 */
	public void verifyUserForLent(UserVerifyRequestDto requestDto) {
		LocalDateTime now = LocalDateTime.now();
		LentPolicyStatus status = LentPolicyStatus.FINE;
		if (!requestDto.getUserRole().equals(UserRole.USER)) {
			status = LentPolicyStatus.NOT_USER;
		}
		if (requestDto.getLentCount() != 0) {
			status = LentPolicyStatus.ALREADY_LENT_USER;
		}
		if (requestDto.getBlackholedAt() != null && requestDto.getBlackholedAt().isBefore(now)) {
			status = LentPolicyStatus.BLACKHOLED_USER;
		}
		if (requestDto.getBanHistories() != null && !requestDto.getBanHistories().isEmpty()) {
			for (BanHistory banHistory : requestDto.getBanHistories()) {
				if (banHistory.getBanType().equals(BanType.ALL)) {
					status = LentPolicyStatus.ALL_BANNED_USER;
					break;
				}
				if (banHistory.getBanType().equals(BanType.SHARE)) {
					status = LentPolicyStatus.SHARE_BANNED_USER;
				}
			}
		}
		LocalDateTime unbannedAt = null;
		if (requestDto.getBanHistories() != null) {
			unbannedAt = requestDto.getBanHistories().stream()
					.map(BanHistory::getUnbannedAt)
					.max(LocalDateTime::compareTo).orElse(null);
		}
		this.handlePolicyStatus(status, unbannedAt);
	}

	/**
	 * 해당 사물함이 대여 가능한 상태인지 확인합니다.
	 *
	 * @param cabinetStatus 사물함 상태
	 * @param lentType      대여 타입
	 */
	public void verifyCabinetForLent(CabinetStatus cabinetStatus, LentType lentType) {
		LentPolicyStatus status = LentPolicyStatus.FINE;
		if (lentType.equals(LentType.CLUB)) {
			status = LentPolicyStatus.LENT_CLUB;
		}
		switch (cabinetStatus) {
			case FULL:
				status = LentPolicyStatus.FULL_CABINET;
			case BROKEN:
				status = LentPolicyStatus.BROKEN_CABINET;
			case OVERDUE:
				status = LentPolicyStatus.OVERDUE_CABINET;
			case PENDING:
				status = LentPolicyStatus.PENDING_CABINET;
		}
		handlePolicyStatus(status, null);
	}

	/**
	 * 사물함의 상태가 대여해도 되는지 확인합니다.
	 *
	 * @param cabinetLentType 사물함 대여 타입
	 * @param lentType        대여 타입
	 */
	public void verifyCabinetType(LentType cabinetLentType, LentType lentType) {
		if (!cabinetLentType.equals(lentType)) {
			throw new ServiceException(ExceptionStatus.INVALID_LENT_TYPE);
		}
	}

	/**
	 * 사물함의 대여 가능한 최대 유저 수와 현재 대여 중인 유저 수를 통해 대여해도 되는지 확인합니다.
	 *
	 * @param lentType     대여 타입
	 * @param maxUserCount 사물함 대여 가능 최대 유저 수
	 * @param lentCount    현재 대여 중인 유저 수
	 */
	public void verifyCabinetLentCount(LentType lentType, int maxUserCount, int lentCount) {
		int maxLentCount = 1;
		if (lentType.equals(LentType.SHARE)) {
			maxLentCount = cabinetProperties.getShareMaxUserCount().intValue();
		}
		if (maxUserCount != maxLentCount) {
			throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
		}
		if (lentCount >= maxLentCount) {
			throw new ServiceException(ExceptionStatus.LENT_FULL);
		}
	}

	/**
	 * 사물함 대여 시에 필요한 만료 기간을 생성합니다.
	 *
	 * @param now           현재 시간
	 * @param lentType      대여 타입
	 * @param lentUserCount 대여 중인 유저 수
	 * @return 만료 시간
	 */
	public LocalDateTime generateExpirationDate(LocalDateTime now, LentType lentType,
			int lentUserCount) {
		if (!DateUtil.isSameDay(now)) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		int lentTerm = 0;
		if (lentType.equals(LentType.PRIVATE)) {
			lentTerm = cabinetProperties.getLentTermPrivate();
		} else if (lentType.equals(LentType.SHARE)) {
			lentTerm = cabinetProperties.getLentTermShareBasic()
					+ cabinetProperties.getLentTermShare() * lentUserCount;
		}
		LocalDateTime expiredAt = DateUtil.setLastTime(now.plusDays(lentTerm));
		if (DateUtil.isPast(expiredAt)) {
			throw new ServiceException(ExceptionStatus.INVALID_EXPIRED_AT);
		}
		return expiredAt;
	}

	/**
	 * 공유 사물함의 만료 시간을 조정합니다.
	 *
	 * @param userCount 조정 후 남는 대여 유저 수
	 * @param now       현재 시간
	 * @param expiredAt 현재 사물함의 만료 시간
	 * @return 조정된 만료 시간
	 */
	public LocalDateTime adjustSharCabinetExpirationDate(int userCount, LocalDateTime now,
			LocalDateTime expiredAt) {
		double daysUntilExpiration = DateUtil.calculateTwoDateDiffCeil(now, expiredAt);
		double secondsUntilExpiration = daysUntilExpiration * 24 * 60 * 60;
		long secondsRemaining = Math.round(secondsUntilExpiration * userCount / (userCount + 1));
		return DateUtil.setLastTime(now.plusSeconds(secondsRemaining));
	}

	/**
	 * 공유 사물함에 해당 유저 수만큼 대여해도 되는지 확인합니다.
	 *
	 * @param userCount 유저 수
	 * @return 대여해도 되는지 여부
	 */
	public boolean verifyUserCountOnShareCabinet(int userCount) {
		long minUserCount = cabinetProperties.getShareMinUserCount();
		long maxUserCount = cabinetProperties.getShareMaxUserCount();
		return minUserCount <= userCount && userCount <= maxUserCount;
	}

	/**
	 * 공유 사물함 세션의 대여 시도 횟수를 확인합니다.
	 *
	 * @param attemptCount 대여 시도 횟수
	 */
	public void verifyAttemptCountOnShareCabinet(Long attemptCount) {
		LentPolicyStatus status = LentPolicyStatus.FINE;
		Long shareMaxAttemptCount = cabinetProperties.getShareMaxAttemptCount();
		if (Objects.nonNull(attemptCount) && attemptCount >= shareMaxAttemptCount) {
			status = LentPolicyStatus.SHARE_BANNED_USER;
		}
		handlePolicyStatus(status, null);
	}
}
