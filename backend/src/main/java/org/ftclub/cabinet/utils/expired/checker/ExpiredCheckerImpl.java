package org.ftclub.cabinet.utils.expired.checker;

import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.cabinet.utils.mail.MailService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExpiredCheckerImpl implements ExpiredChecker {
    private MailService mailService;
    private DateUtil dateUtil;

    @Override
    public Boolean checkExpired(Date expiredAt) {
        // 만료기한이 지났는지 확인
        return false;
    }

    // 연체 기한에 따라 발송해야 할 메일 템플릿 변경
    public void selectMailTemplate(Date expiredAt) {

    }

    @Override
    public void handleExpired(LentDto lentDto) {
        // 만료기한을 넘겼다면 사물함 상태 EXPIRED로 변경
        // 유저에게 연체 메일 발송
        return;
    }
}
