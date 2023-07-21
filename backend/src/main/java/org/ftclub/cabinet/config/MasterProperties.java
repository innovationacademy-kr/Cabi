package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MasterProperties {

	@Value("${spring.oauth2.master.id}")
	private String id;

	@Value("${spring.oauth2.master.password}")
	private String password;

	@Value("${spring.oauth2.master.domain}")
	private String domain;

	@Value("${spring.oauth2.master.email}")
	private String email;

}
