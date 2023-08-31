package org.ftclub.cabinet.lent.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.exception.*;
import org.ftclub.cabinet.redis.TicketingSharedCabinet;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Log4j2
public class LentPolicyImpl implements LentPolicy {

	private final CabinetProperties cabinetProperties;
	private final ApplicationEventPublisher publisher;
	private final TicketingSharedCabinet ticketingSharedCabinet;

	@Override
	public LocalDateTime generateSharedCabinetExpirationDate(LocalDateTime now,
															 Integer totalUserCount) {
		log.info("Called generateSharedCabinetExpirationDate now: {}, totalUserCount: {}", now,
				totalUserCount);

		return now.plusDays(getDaysForLentTermShare(totalUserCount));
	}

	@Override
	public LocalDateTime generateExpirationDate(LocalDateTime now, Cabinet cabinet) {
		log.info("Called generateExpirationDate now: {}, cabinet: {}", now, cabinet);

		if (!DateUtil.isSameDay(now)) {
			throw new IllegalArgumentException("현재 시각이 아닙니다.");
		}

		LentType lentType = cabinet.getLentType();
		switch (lentType) {
			case PRIVATE:
				return now.plusDays(getDaysForLentTermPrivate());
			case CLUB:
				return DateUtil.getInfinityDate();
		}
		throw new IllegalArgumentException("대여 상태가 잘못되었습니다.");
	}

	@Override
	public LocalDateTime generateExtendedExpirationDate(LocalDateTime now) {
		log.info("Called generateExtendedExpirationDate now: {}, cabinet: {}", now);
		if (!DateUtil.isSameDay(now)) {
			throw new IllegalArgumentException("현재 시각이 아닙니다.");
		}
		return now.plusDays(getDaysForLentTermPrivate());
	}

	@Override
	public void applyExpirationDate(LentHistory curHistory, LocalDateTime expiredAt) {
		log.info(
				"Called applyExpirationDate curHistory: {}, expiredAt: {}", curHistory, expiredAt);
		if (expiredAt == null) {
			throw new DomainException(ExceptionStatus.INVALID_ARGUMENT);
		}
		if (DateUtil.isPast(expiredAt)) {
			throw new DomainException(ExceptionStatus.INVALID_EXPIRED_AT);
		}
		curHistory.setExpiredAt(expiredAt);
	}

	@Override
	public LentPolicyStatus verifyUserForLent(User user, Cabinet cabinet, int userActiveLentCount,
											  List<BanHistory> userActiveBanList) {
		log.debug("Called verifyUserForLent");
		if (!user.isUserRole(UserRole.USER)) {
			return LentPolicyStatus.NOT_USER;
		}
		if (userActiveLentCount != 0) {
			return LentPolicyStatus.ALREADY_LENT_USER;
		}
		if (user.getBlackholedAt() != null && user.getBlackholedAt()
				.isBefore(LocalDateTime.now())) {
			publisher.publishEvent(UserBlackholeInfoDto.of(user));
			if (user.getBlackholedAt() != null && user.getBlackholedAt()
					.isBefore(LocalDateTime.now())) {
				return LentPolicyStatus.BLACKHOLED_USER;
			}
		}

		// 유저가 페널티 2 종류 이상 받을 수 있나? <- 실제로 그럴리 없지만 lentPolicy 객체는 그런 사실을 모르고, 유연하게 구현?
		if (userActiveBanList == null || userActiveBanList.isEmpty()) {
			return LentPolicyStatus.FINE;
		}
		LentPolicyStatus ret = LentPolicyStatus.FINE;
		for (BanHistory banHistory : userActiveBanList) {
			switch (banHistory.getBanType()) {
				case ALL:
					return LentPolicyStatus.ALL_BANNED_USER;
				case SHARE:
					if (cabinet.isLentType(LentType.SHARE)) {
						ret = LentPolicyStatus.SHARE_BANNED_USER;
					}
					break;
				default:
					break;
			}
		}
		return ret;
	}

	@Override
	public LentPolicyStatus verifyUserForLentShare(User user, Cabinet cabinet,
												   int userActiveLentCount,
												   List<BanHistory> userActiveBanList) {

		LentPolicyStatus ret = verifyUserForLent(user, cabinet, userActiveLentCount,
				userActiveBanList);

		// 유저가 패스워드를 3번 이상 틀린 경우
		Long cabinetId = cabinet.getCabinetId();
		Long userId = user.getUserId();
		// 사물함을 빌릴 수 있는 유저라면 공유 사물함 비밀번호 입력 횟수를 확인
		if (ret == LentPolicyStatus.FINE && ticketingSharedCabinet.isShadowKey(
				cabinet.getCabinetId())) {
			String passwordCount = ticketingSharedCabinet.getValue(cabinetId.toString(), userId.toString());
			// 사물함을 빌릴 수 있는 유저면서, 해당 공유사물함에 처음 접근하는 유저인 경우
			if (passwordCount != null && Integer.parseInt(passwordCount) >= 3) {
				ret = LentPolicyStatus.SHARE_BANNED_USER;
			}
		}
		return ret;
	}

	@Override
	public LentPolicyStatus verifyCabinetForLent(Cabinet cabinet) {
		log.info("Called verifyCabinetForLent cabinet: {}", cabinet);
		// 빌릴 수 있는지 검증. 빌릴 수 없으면 return lentPolicyDto;
		switch (cabinet.getStatus()) {
			case FULL:
				return LentPolicyStatus.FULL_CABINET;
			case BROKEN:
				return LentPolicyStatus.BROKEN_CABINET;
			case OVERDUE:
				return LentPolicyStatus.OVERDUE_CABINET;
			case PENDING:
				return LentPolicyStatus.PENDING_CABINET;
		}
		if (cabinet.isLentType(LentType.CLUB)) {
			return LentPolicyStatus.LENT_CLUB;
		}
		// 기존의 공유사물함 정책에서 검사해야 되는 부분 -> 현재 필요 x
//		if (cabinet.isLentType(LentType.SHARE)) {
//			if (cabinetLentHistories == null || cabinetLentHistories.isEmpty()) {
//				return LentPolicyStatus.INTERNAL_ERROR;
//			}
//			Long diffDays = DateUtil.calculateTwoDateDiffAbs(
//					cabinetLentHistories.get(0).getExpiredAt(), now);
//			if (diffDays <= getDaysForNearExpiration()) {   //
//				return LentPolicyStatus.IMMINENT_EXPIRATION;
//			}
//		}
		return LentPolicyStatus.FINE;
	}

	@Override
	public Integer getDaysForLentTermPrivate() {
		log.debug("Called getDaysForLentTermPrivate");
		return cabinetProperties.getLentTermPrivate();
	}

	@Override
	public Integer getDaysForLentTermShare(Integer totalUserCount) {
		log.debug("Called getDaysForLentTermShare");
		return cabinetProperties.getLentTermShare() * totalUserCount;
	}

	@Override
	public int getDaysForTermExtend() {
		log.debug("Called getDaysForTermExtend");
		return cabinetProperties.getLentTermExtend();
	}

	@Override
	public Integer getDaysForNearExpiration() {
		log.debug("Called getDaysForNearExpiration");
		return cabinetProperties.getPenaltyDayShare() + cabinetProperties.getPenaltyDayPadding();
	}

	@Override
	public void handlePolicyStatus(LentPolicyStatus status, List<BanHistory> banHistory)
			throws ServiceException {
		log.info("Called handlePolicyStatus status: {}", status);
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
				handleBannedUserResponse(status, banHistory.get(0));
//			case SHARE_BANNED_USER:

			case BLACKHOLED_USER:
				throw new ServiceException(ExceptionStatus.BLACKHOLED_USER);
			case NOT_USER:
			case INTERNAL_ERROR:
			default:
				throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void handleBannedUserResponse(LentPolicyStatus status, BanHistory banHistory) {
		log.info("Called handleBannedUserResponse: {}", status);

		LocalDateTime unbannedAt = banHistory.getUnbannedAt();
		String unbannedTimeString = unbannedAt.format(
				DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

		if (status.equals(LentPolicyStatus.ALL_BANNED_USER)) {
			throw new CustomServiceException(
					new CustomExceptionStatus(ExceptionStatus.ALL_BANNED_USER, unbannedTimeString));
		} else if (status.equals(LentPolicyStatus.SHARE_BANNED_USER)) {
			throw new CustomServiceException(
					new CustomExceptionStatus(ExceptionStatus.SHARE_BANNED_USER,
							unbannedTimeString));
		}
	}
}
