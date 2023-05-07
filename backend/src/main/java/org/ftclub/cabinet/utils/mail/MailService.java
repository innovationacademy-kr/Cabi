package org.ftclub.cabinet.utils.mail;

public interface MailService {
    /**
     * 유저에게 메일을 보내는 메소드
     *
     * @param to      - 유저의 이메일
     * @param subject - 메일 제목
     * @param text    - 메일 내용
     */
    public void sendMail(String to, String subject, String text);
}
