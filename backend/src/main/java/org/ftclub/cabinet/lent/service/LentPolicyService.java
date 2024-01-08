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
import org.ftclub.cabinet.lent.domain.LentHistory;
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

	public void verifyCabinetType(LentType cabinetLentType, LentType lentType) {
		if (!cabinetLentType.equals(lentType)) {
			throw new ServiceException(ExceptionStatus.INVALID_LENT_TYPE);
		}
	}

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

	public LocalDateTime adjustSharCabinetExpirationDate(int userCount, LocalDateTime now,
			LentHistory lentHistory) {
		double daysUntilExpiration = lentHistory.getDaysUntilExpiration(now) * -1;
		double secondsUntilExpiration = daysUntilExpiration * 24 * 60 * 60;
		long secondsRemaining = Math.round(secondsUntilExpiration * userCount / (userCount + 1));
		return DateUtil.setLastTime(now.plusSeconds(secondsRemaining));
	}

	public boolean verifyUserCountOnShareCabinet(int userCount) {
		long minUserCount = cabinetProperties.getShareMinUserCount();
		long maxUserCount = cabinetProperties.getShareMaxUserCount();
		return minUserCount <= userCount && userCount <= maxUserCount;
	}

	public void verifyAttemptCountOnShareCabinet(Long attemptCount) {
		LentPolicyStatus status = LentPolicyStatus.FINE;
		Long shareMaxAttemptCount = cabinetProperties.getShareMaxAttemptCount();
		if (Objects.nonNull(attemptCount) && attemptCount >= shareMaxAttemptCount) {
			status = LentPolicyStatus.SHARE_BANNED_USER;
		}
		handlePolicyStatus(status, null);
	}
}
