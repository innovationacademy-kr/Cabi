package org.ftclub.cabinet.lent.domain;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

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
    public Date generateExpirationDate(Date now, LentType lentType, LentHistory lentHistory) {
        if (lentHistory != null)
            return lentHistory.getExpiredAt();
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
    public LentPolicyStatus verifyUserForLent(User user, int userActiveLentCount) {
        if (!user.isUserRole(UserRole.USER)) return LentPolicyStatus.NOT_USER;
        if (userActiveLentCount >= 1) return LentPolicyStatus.ALREADY_LENT_USER;
        return LentPolicyStatus.FINE;
    }

    @Override
    public LentPolicyStatus verifyCabinetForLent(Cabinet cabinet, LentHistory cabinetLentHistory, Date now) {
        switch (cabinet.getStatus()) {
            case FULL: return LentPolicyStatus.FULL_CABINET;
            case BROKEN: return LentPolicyStatus.BROKEN_CABINET;
            case OVERDUE: return LentPolicyStatus.OVERDUE_CABINET;
        }
        if (cabinet.isLentType(LentType.CLUB))
            return LentPolicyStatus.LENT_CLUB;
        if (cabinet.isLentType(LentType.SHARE)
            && cabinet.getStatus() == CabinetStatus.LIMITED_AVAILABLE) {
            if (cabinetLentHistory == null)
                return LentPolicyStatus.INTERNAL_ERROR;
            Long diffDays = DateUtil.calculateTwoDateDiffAbs(cabinetLentHistory.getExpiredAt(), now);
            if (diffDays <= getDaysForNearExpiration())
                return LentPolicyStatus.LENT_UNDER_PENALTY_DAY_SHARE;
        }
        return LentPolicyStatus.FINE;
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
