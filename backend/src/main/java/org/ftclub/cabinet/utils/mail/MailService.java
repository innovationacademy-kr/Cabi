package org.ftclub.cabinet.utils.mail;

import java.io.IOException;
import javax.mail.MessagingException;


/**
 * 메일을 보내기 위한 인터페이스
 */
public interface MailService {

    /**
     * 유저에게 메일을 보내는 메소드
     *
     * @param to       - 유저의 이메일
     * @param subject  - 메일 제목
     * @param template - 메일 템플릿
     */
    public void sendMail(String to, String subject, String template)
            throws MessagingException, IOException;
}
