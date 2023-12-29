package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MasterProperties {

	@Value("${cabinet.master.id}")
	private String id;

	@Value("${cabinet.master.password}")
	private String password;

	@Value("${cabinet.master.domain}")
	private String domain;

	@Value("${cabinet.master.email}")
	private String email;

}
