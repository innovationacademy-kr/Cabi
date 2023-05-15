package org.ftclub.cabinet.utils.overdue.manager;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.LentHistoryWithNameExpiredAtDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.utils.mail.MailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OverdueManagerImpl implements OverdueManager {

    private final MailSender mailSender;
    private final CabinetService cabinetService;

    @Value("${spring.mail.soonoverdue.term}")
    private Long SOON_OVERDUE_TERM;

    @Value("${spring.mail.overdue.subject}")
    private String OVERDUE_MAIL_SUBJECT;

    @Value("${spring.mail.overdue.template}")
    private String OVERDUE_MAIL_TEMPLATE_URL;

    @Value("${spring.mail.soonoverdue.subject}")
    private String SOON_OVERDUE_MAIL_SUBJECT;

    @Value("${spring.mail.soonoverdue.template}")
    private String SOON_OVERDUE_MAIL_TEMPLATE_URL;

    @Override
    public String getOverdueMailSubject() {
        return this.OVERDUE_MAIL_SUBJECT;
    }

    @Override
    public String getOverdueMailTemplateUrl() {
        return this.OVERDUE_MAIL_TEMPLATE_URL;
    }

    @Override
    public String getSoonOverdueMailSubject() {
        return this.SOON_OVERDUE_MAIL_SUBJECT;
    }

    @Override
    public String getSoonOverdueMailTemplateUrl() {
        return this.SOON_OVERDUE_MAIL_TEMPLATE_URL;
    }

    @Override
    public Long getSoonOverdueTerm() {
        return this.SOON_OVERDUE_TERM;
    }


    /**
     * 연체 타입을 반환하는 메소드 연체 예정인 경우, SOON_OVERDUE를 반환하고, 연체 기간이 지난 경우, OVERDUE를 반환한다. 그 외의 경우, NONE을
     * 반환한다.
     *
     * @param lentHistory 대여 기록
     * @return 연체 타입
     */
    public OverdueType getOverdueType(LentHistory lentHistory) {
        if (lentHistory.isExpired()) {
            return OverdueType.OVERDUE;
        }
        Long daysLeftFromOverdue = lentHistory.getDaysLeftFromOverdueDay();
        if (daysLeftFromOverdue.equals(this.getSoonOverdueTerm())) {
            return OverdueType.SOON_OVERDUE;
        }
        return OverdueType.NONE;
    }

    @Override
    public void handleOverdue(LentHistoryWithNameExpiredAtDto lent) {
        LentHistory lentHistory = LentHistory.of(lent.getStartedAt(), lent.getExpiredAt(),
                lent.getUserId(),
                lent.getCabinetId());

        String subject = null, template = null;
        OverdueType overdueType = this.getOverdueType(lentHistory);

        switch (overdueType) {
            case NONE:
                return;
            case SOON_OVERDUE:
                subject = this.getSoonOverdueMailSubject();
                template = this.getSoonOverdueMailTemplateUrl();
                break;
            case OVERDUE:
                this.cabinetService.updateStatus(lent.getCabinetId(),
                        CabinetStatus.OVERDUE);
                subject = this.getOverdueMailSubject();
                template = this.getOverdueMailTemplateUrl();
                break;
        }
        try {
            this.mailSender.sendMail(lent.getName(), lent.getEmail(), subject, template);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
