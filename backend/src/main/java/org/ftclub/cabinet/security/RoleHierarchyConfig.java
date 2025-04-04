package org.ftclub.cabinet.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.SecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;

/**
 * Security 인가 검증 시, MASTER 권한을 최상위로 명시합니다.
 */
@Configuration
public class RoleHierarchyConfig {


	@Bean
	public RoleHierarchy roleHierarchy() {
		RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();

		roleHierarchy.setHierarchy(
				"ROLE_MASTER > ROLE_ADMIN\n" +
						"ROLE_ADMIN > ROLE_USER\n" +
						"ROLE_USER > ROLE_AGU"
		);
		return roleHierarchy;
	}

	@Bean
	public SecurityExpressionHandler<FilterInvocation> expressionHandler() {
		DefaultWebSecurityExpressionHandler expressionHandler = new DefaultWebSecurityExpressionHandler();
		expressionHandler.setRoleHierarchy(roleHierarchy());

		return expressionHandler;
	}
}
