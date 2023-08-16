package org.ftclub.cabinet.lent.domain;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.cabinet.utils.blackhole.manager.BlackholeRefresher;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class LentPolicyImpl implements LentPolicy {

	private final CabinetProperties cabinetProperties;
	private final ApplicationEventPublisher publisher;


	private LocalDateTime generateSharedCabinetExpirationDate(LocalDateTime now,
			CabinetStatus cabinetStatus, LentHistory activeLentHistory) {
		log.debug("Called shareCabinetExpirationDateProcess");

		switch (cabinetStatus) {
			case AVAILABLE:
				return DateUtil.getInfinityDate();

			case LIMITED_AVAILABLE:
				return activeLentHistory.getExpiredAt();

			case FULL:
				if (activeLentHistory.isSetExpiredAt()) {
					return activeLentHistory.getExpiredAt();
				}
				return now.plusDays(getDaysForLentTermShare());

			default:
				throw new IllegalArgumentException("대여 현황 상태가 잘못되었습니다.");
		}
	}

	@Override
	public LocalDateTime generateExpirationDate(LocalDateTime now, Cabinet cabinet,
			List<LentHistory> activeLentHistories) {
		log.info("Called generateExpirationDate now: {}, cabinet: {}, activeLentHistories: {}",
				now, cabinet, activeLentHistories);

		if (!DateUtil.isSameDay(now)) {
			throw new IllegalArgumentException("현재 시각이 아닙니다.");
		}

		LentType lentType = cabinet.getLentType();
		switch (lentType) {
			case PRIVATE:
				return now.plusDays(getDaysForLentTermPrivate());
			case SHARE:
				if (activeLentHistories.isEmpty()) {
					return DateUtil.getInfinityDate();
				}
				LentHistory lentHistory = activeLentHistories.get(0);
				return generateSharedCabinetExpirationDate(now,
						cabinet.getStatus(), lentHistory);
			case CLUB:
				return DateUtil.getInfinityDate();
		}
		throw new IllegalArgumentException("대여 상태가 잘못되었습니다.");
	}

	@Override
	public void applyExpirationDate(LentHistory curHistory, List<LentHistory> beforeActiveHistories,
			LocalDateTime expiredAt) {
		log.info(
				"Called applyExpirationDate curHistory: {}, beforeActiveHistories: {}, expiredAt: {}",
				curHistory, beforeActiveHistories, expiredAt);

		if (expiredAt == null) {
			throw new DomainException(ExceptionStatus.INVALID_ARGUMENT);
		}

		if (DateUtil.isPast(expiredAt)) {
			throw new DomainException(ExceptionStatus.INVALID_EXPIRED_AT);
		}

		for (LentHistory lentHistory : beforeActiveHistories) {
			lentHistory.setExpiredAt(expiredAt);
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
		if (userActiveLentCount >= 1) {
			return LentPolicyStatus.ALREADY_LENT_USER;
		}
		if (user.getBlackholedAt() != null && user.getBlackholedAt()
				.isBefore(LocalDateTime.now())) {
			publisher.publishEvent(UserBlackholeInfoDto.of(user));
			throw new DomainException(ExceptionStatus.BLACKHOLE_REFRESHING);

//			if(user.getBlackholedAt() != null && user.getBlackholedAt().isBefore(LocalDateTime.now()))
//				return LentPolicyStatus.BLACKHOLED_USER;

//			if(blackholeRefresher.isBlackholedAndUpdateBlackhole(UserBlackholeInfoDto.of(user)))
//				return LentPolicyStatus.BLACKHOLED_USER;
		}

		// 유저가 페널티 2 종류 이상 받을 수 있나? <- 실제로 그럴리 없지만 lentPolicy 객체는 그런 사실을 모르고, 유연하게 구현?
		if (userActiveBanList == null || userActiveBanList.size() == 0) {
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
	public LentPolicyStatus verifyCabinetForLent(Cabinet cabinet,
			List<LentHistory> cabinetLentHistories, LocalDateTime now) {
		log.info("Called verifyCabinetForLent cabinet: {}, cabinetLentHistories: {}, now: {}",
				cabinet, cabinetLentHistories, now);
		// 빌릴 수 있는지 검증. 빌릴 수 없으면 return lentPolicyDto;
		switch (cabinet.getStatus()) {
			case FULL:
				return LentPolicyStatus.FULL_CABINET;
			case BROKEN:
				return LentPolicyStatus.BROKEN_CABINET;
			case OVERDUE:
				return LentPolicyStatus.OVERDUE_CABINET;
		}
		if (cabinet.isLentType(LentType.CLUB)) {
			return LentPolicyStatus.LENT_CLUB;
		}
		if (cabinet.isLentType(LentType.SHARE)
				&& cabinet.isStatus(CabinetStatus.LIMITED_AVAILABLE)) {
			if (cabinetLentHistories == null || cabinetLentHistories.isEmpty()) {
				return LentPolicyStatus.INTERNAL_ERROR;
			}
			Long diffDays = DateUtil.calculateTwoDateDiffAbs(
					cabinetLentHistories.get(0).getExpiredAt(), now);
			if (diffDays <= getDaysForNearExpiration()) {
				return LentPolicyStatus.IMMINENT_EXPIRATION;
			}
		}
		return LentPolicyStatus.FINE;
	}

	@Override
	public Integer getDaysForLentTermPrivate() {
		log.debug("Called getDaysForLentTermPrivate");
		return cabinetProperties.getLentTermPrivate();
	}

	@Override
	public Integer getDaysForLentTermShare() {
		log.debug("Called getDaysForLentTermShare");
		return cabinetProperties.getLentTermShare();
	}

	@Override
	public Integer getDaysForNearExpiration() {
		log.debug("Called getDaysForNearExpiration");
		return cabinetProperties.getPenaltyDayShare() + cabinetProperties.getPenaltyDayPadding();
	}
}
