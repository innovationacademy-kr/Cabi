package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class GmailProperties {

    @Value("${spring.mail.production}")
    private Boolean isProduction;

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    private Boolean useAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private Boolean useStartTls;
}
