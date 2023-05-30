package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Getter
public class DomainNameProperties {

    @Value("${domain-name.cookie-domain}")
    private String cookieDomain;

    @Value("${domain-name.local}")
    private String local;

    @Value("${domain-name.dev}")
    private String dev;

    @Value("${domain-name.main}")
    private String main;
}

