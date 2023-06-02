package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MasterProperties {

	@Value("${spring.cabinet.master.id}")
	private String id;

	@Value("${spring.cabinet.master.password}")
	private String password;

	@Value("${spring.cabinet.master.domain}")
	private String domain;

	@Value("${spring.cabinet.master.email}")
	private String email;

}
