package org.ftclub.cabinet.utils.overdue.manager;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.LentHistoryWithNameExpirationDto;
import org.ftclub.cabinet.utils.mail.MailSender;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class OverdueManagerTest {

    @Autowired
    OverdueManager overdueManager;
    @Autowired
    private MailSender mailSender;

    @MockBean
    private CabinetService cabinetService;
    @Captor
    private ArgumentCaptor<Long> cabinetIdCaptor;

    @Captor
    private ArgumentCaptor<CabinetStatus> cabinetStatusCaptor;

    @Test
    public void testHandleOverdue연체되기_하루_전날인_유저() {
        // 연체되기 하루 전날인 유저의 대여 정보
        LentHistoryWithNameExpirationDto lentHistory = new LentHistoryWithNameExpirationDto(
                1l,
                "test",
                "test@gmail.com",
                1l,
                true,
                1l
        );

        // handleOverdue를 호출한다.
        overdueManager.handleOverdue(lentHistory);

        // cabinetService.updateStatus()가 호출되지 않았는지 확인한다.
        verify(cabinetService, times(0)).updateStatus(cabinetIdCaptor.capture(),
                cabinetStatusCaptor.capture());

        // mailSender.sendMail()가 호출되었는지 확인한다.
        try {
            verify(mailSender, times(1)).sendMail(
                    "test",
                    "test@gmail.com",
                    overdueManager.getSoonOverdueMailSubject(),
                    overdueManager.getSoonOverdueMailTemplateUrl()
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testHandleOverdue연체되기_전_마지막_날인_유저() {
        // 연체되기 전 마지막 날인 유저의 대여 정보
        LentHistoryWithNameExpirationDto lentHistory = new LentHistoryWithNameExpirationDto(
                1l,
                "test",
                "test@gmail.com",
                1l,
                true,
                1l
        );

        // handleOverdue를 호출한다.
        overdueManager.handleOverdue(lentHistory);

        // cabinetService.updateStatus()가 호출되지 않았는지 확인한다.
        verify(cabinetService, times(0)).updateStatus(cabinetIdCaptor.capture(),
                cabinetStatusCaptor.capture());

        // mailSender.sendMail()가 호출되지 않았는지 확인한다.
        try {
            verify(mailSender, times(0)).sendMail(
                    "test",
                    "test@gmail.com",
                    overdueManager.getSoonOverdueMailSubject(),
                    overdueManager.getSoonOverdueMailTemplateUrl()
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testHandleOverdue연체_당일인_유저() {
        // 연체당일인 유저의 대여 정보
        LentHistoryWithNameExpirationDto lentHistory = new LentHistoryWithNameExpirationDto(
                1l,
                "test",
                "test@gmail.com",
                1l,
                true,
                1l
        );

        // handleOverdue를 호출한다.
        overdueManager.handleOverdue(lentHistory);

        // cabinetService.updateStatus()가 호출되었는지 확인한다.
        verify(cabinetService, times(1)).updateStatus(cabinetIdCaptor.capture(),
                cabinetStatusCaptor.capture());

        // mailSender.sendMail()가 호출되었는지 확인한다.
        try {
            verify(mailSender, times(1)).sendMail(
                    "test",
                    "test@gmail.com",
                    overdueManager.getSoonOverdueMailSubject(),
                    overdueManager.getSoonOverdueMailTemplateUrl()
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testHandleOverdue연체_n일차인_유저() {
        // 연체 n일차인 유저의 대여 정보
        LentHistoryWithNameExpirationDto lentHistory = new LentHistoryWithNameExpirationDto(
                1l,
                "test",
                "test@gmail.com",
                1l,
                true,
                1l
        );

        // handleOverdue를 호출한다.
        overdueManager.handleOverdue(lentHistory);

        // mailSender.sendMail()가 호출되었는지 확인한다.
        try {
            verify(mailSender, times(1)).sendMail(
                    "test",
                    "test@gmail.com",
                    overdueManager.getSoonOverdueMailSubject(),
                    overdueManager.getSoonOverdueMailTemplateUrl()
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

