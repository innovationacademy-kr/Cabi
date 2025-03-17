package org.ftclub.cabinet.config.security.exception;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SecurityExceptionConfig {

	@Bean
	public SecurityExceptionHandlerManager securityExceptionHandlerManager(
			SecurityDefaultExceptionHandler defaultExceptionHandler,
			SecurityRedirectExceptionHandler redirectExceptionHandler) {
		return new SecurityExceptionHandlerManager(defaultExceptionHandler,
				redirectExceptionHandler);
	}

	@Bean
	public SecurityDefaultExceptionHandler defaultExceptionHandler() {
		return new SecurityDefaultExceptionHandler();
	}

	@Bean
	public SecurityRedirectExceptionHandler redirectExceptionHandler(
			AuthPolicyService authPolicyService) {
		return new SecurityRedirectExceptionHandler(authPolicyService);
	}
}
