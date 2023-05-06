package org.ftclub.cabinet.lent.domain;

import java.util.Date;
import java.util.List;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class LentPolicyImpl implements LentPolicy {

	@Value("${cabinet.lent.term.private}")
	private static Integer LENT_TERM_PRIVATE;

	@Value("${cabinet.lent.term.share}")
	private static Integer LENT_TERM_SHARE;

	@Value("${cabinet.penalty.day.share}")
	private static Integer PENALTY_DAY_SHARE;

	@Value("${cabinet.penalty.day.padding}")
	private static Integer PENALTY_DAY_PADDING;

	@Override
	public Date generateExpirationDate(Date now, LentType lentType, LentHistory lentHistory, SetExpiredEnum setExpiredEnum) {
		if (setExpiredEnum == SetExpiredEnum.SET_INFINITE_EXPIRED) {
			return DateUtil.stringToDate("9999-12-31");
		}
        if (lentHistory != null) {
            return lentHistory.getExpiredAt();
        }
		int days = 0;
		switch (lentType) {
			case PRIVATE:
				days = getDaysForLentTermPrivate();
				break;
			case SHARE:
				days = getDaysForLentTermShare();
				break;
			case CLUB:
				days = 9999; // 임의로 적당히 큰 수 넣었습니다.
				break;
		}
		return DateUtil.addDaysToDate(now, days);
	}

	@Override
	public LentPolicyStatus verifyUserForLent(User user, Cabinet cabinet, int userActiveLentCount, List<BanHistory> userActiveBanList) {
        if (!user.isUserRole(UserRole.USER))
            return LentPolicyStatus.NOT_USER;
        if (userActiveLentCount >= 1)
            return LentPolicyStatus.ALREADY_LENT_USER;
		if (user.getBlackholedAt().before(new Date()))
			return LentPolicyStatus.BLACKHOLED_USER;
		// 유저가 페널티 2 종류 이상 받을 수 있나? <- 실제로 그럴리 없지만 lentPolicy 객체는 그런 사실을 모르고, 유연하게 구현?
		if (userActiveBanList.size() == 0) return LentPolicyStatus.FINE;
		else if (cabinet.getLentType() == LentType.PRIVATE) {
			for (BanHistory banHistory : userActiveBanList) {
				if (banHistory.getBanType() == BanType.PRIVATE) return LentPolicyStatus.PRIVATE_BANNED_USER;
			}
		} else { // cabinet.getStatus() == LentType.PUBLIC
			for (BanHistory banHistory : userActiveBanList) {
				if (banHistory.getBanType() == BanType.PRIVATE) return LentPolicyStatus.PRIVATE_BANNED_USER;
				if (banHistory.getBanType() == BanType.SHARE) return LentPolicyStatus.PUBLIC_BANNED_USER;
			}
		}
		return LentPolicyStatus.FINE;
	}

	@Override
	public LentPolicyDto verifyCabinetForLent(Cabinet cabinet, LentHistory cabinetLentHistory, int cabinetActiveLent,
											  Date now) {
		LentPolicyDto lentPolicyDto = new LentPolicyDto(SetExpiredEnum.NONE, LentPolicyStatus.FINE);
		// 빌릴 수 있는지 검증. 빌릴 수 없으면 return lentPolicyDto;
		switch (cabinet.getStatus()) {
			case FULL:
				lentPolicyDto.setLentPolicyStatus(LentPolicyStatus.FULL_CABINET);
				return lentPolicyDto;
			case BROKEN:
				lentPolicyDto.setLentPolicyStatus(LentPolicyStatus.BROKEN_CABINET);
				return lentPolicyDto;
			case OVERDUE:
				lentPolicyDto.setLentPolicyStatus(LentPolicyStatus.OVERDUE_CABINET);
				return lentPolicyDto;
		}
        if (cabinet.isLentType(LentType.CLUB)) {
			lentPolicyDto.setLentPolicyStatus(LentPolicyStatus.LENT_CLUB);
			return lentPolicyDto;
        }
		if (cabinet.isLentType(LentType.SHARE)
				&& cabinet.getStatus() == CabinetStatus.LIMITED_AVAILABLE) {
            if (cabinetLentHistory == null) {
				lentPolicyDto.setLentPolicyStatus(LentPolicyStatus.INTERNAL_ERROR);
				return lentPolicyDto;
			}
			Long diffDays = DateUtil.calculateTwoDateDiffAbs(cabinetLentHistory.getExpiredAt(),
					now);
            if (diffDays <= getDaysForNearExpiration()) {
				lentPolicyDto.setLentPolicyStatus(LentPolicyStatus.LENT_UNDER_PENALTY_DAY_SHARE);
				return lentPolicyDto;
            }
		}
		// 유저가 사물함을 빌리고 난 후에 cabinet.status가 무엇으로 변경될지 결정
		// 생성될 lentHistory에 expired_at 필드 값을 어떻게 설정할지 결정
		if (cabinetActiveLent + 1 == cabinet.getMaxUser()) {
			lentPolicyDto.setCabinetStatus(CabinetStatus.FULL);
			// 처음 풀방이 됨
			if (cabinet.getStatus() == CabinetStatus.AVAILABLE) {
				if (cabinet.getLentType() == LentType.PRIVATE) {
					lentPolicyDto.setSetExpiredEnum(SetExpiredEnum.PRIVATE_NEW_EXPIRED);
				} else { //cabinet.getLentType() == LentType.PUBLIC
					lentPolicyDto.setSetExpiredEnum(SetExpiredEnum.SHARED_NEW_EXPIRED);
				}
			} else if (cabinet.getStatus() == CabinetStatus.LIMITED_AVAILABLE) {
				lentPolicyDto.setSetExpiredEnum(SetExpiredEnum.SHARED_EXIST_EXPIRED);
			} // 이외의 경우는 없음
		} else {
			lentPolicyDto.setCabinetStatus(cabinet.getStatus());
			if (cabinet.getStatus() == CabinetStatus.AVAILABLE) {
				lentPolicyDto.setSetExpiredEnum(SetExpiredEnum.SET_INFINITE_EXPIRED);
			} else if (cabinet.getStatus() == CabinetStatus.LIMITED_AVAILABLE) {
				lentPolicyDto.setSetExpiredEnum(SetExpiredEnum.SHARED_EXIST_EXPIRED);
			} // 이외의 경우는 없음
		}
		return lentPolicyDto;
	}

	@Override
	public Integer getDaysForLentTermPrivate() {
		return LENT_TERM_PRIVATE;
	}

	@Override
	public Integer getDaysForLentTermShare() {
		return LENT_TERM_SHARE;
	}

	@Override
	public Integer getDaysForNearExpiration() {
		return PENALTY_DAY_SHARE + PENALTY_DAY_PADDING;
	}
}
