package org.ftclub.cabinet.utils.overdue.checker;

import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.cabinet.utils.mail.MailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OverdueCheckerImpl implements OverdueChecker {

    private final MailSender mailSender;
    private final DateUtil dateUtil;
    private final CabinetFacadeService cabinetFacadeService;

    @Value("${overdue.term.soonoverdue}")
    private static Integer SOON_OVERDUE_TERM;

    @Value("${overdue.term.overdue}")
    private static Integer OVERDUE_TERM;

    @Override
    public Integer getSoonOverdueTerm() {
        return this.SOON_OVERDUE_TERM;
    }

    @Override
    public Integer getOverdueTerm() {
        return this.OVERDUE_TERM;
    }

    @Override
    public void handleOverdue(LentHistoryDto lent) {
        Integer overDueDays = dateUtil.calculateTwoDateDiffAbs(new Date(), lent.getEndedAt())
                .intValue();
        if (overDueDays >= this.getSoonOverdueTerm()) {
            String subject = "42CABI 사물함 대여 기간 만료 예정 안내";
            String template = "resources/templates/soonoverdue.html";
            if (overDueDays >= this.getOverdueTerm()) {
                subject = "42CABI 사물함 연체 알림";
                template = "resources/templates/overdue.html";
                this.cabinetFacadeService.updateCabinetStatus(lent.getCabinetId(),
                        CabinetStatus.OVERDUE);
            }
            // handle exception
            try {
                this.mailSender.sendMail(lent.getName(), subject, template);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
