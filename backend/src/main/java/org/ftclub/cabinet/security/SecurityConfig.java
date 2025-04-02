package org.ftclub.cabinet.security;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.security.filter.JwtAuthenticationFilter;
import org.ftclub.cabinet.security.filter.JwtExceptionFilter;
import org.ftclub.cabinet.security.filter.LoggingFilter;
import org.ftclub.cabinet.security.handler.CustomAccessDeniedHandler;
import org.ftclub.cabinet.security.handler.CustomAuthenticationEntryPoint;
import org.ftclub.cabinet.security.handler.CustomOAuth2UserService;
import org.ftclub.cabinet.security.handler.CustomSuccessHandler;
import org.ftclub.cabinet.security.handler.LogoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.SecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextHolderFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final JwtExceptionFilter jwtExceptionFilter;
	private final LoggingFilter loggingFilter;
	private final CustomSuccessHandler customSuccessHandler;
	private final CustomAuthenticationEntryPoint entryPoint;
	private final CustomAccessDeniedHandler accessDeniedHandler;
	private final SecurityExpressionHandler<FilterInvocation> expressionHandler;
	private final LogoutHandler logoutHandler;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http)
			throws Exception {
		http.csrf(AbstractHttpConfigurer::disable)
				.formLogin(AbstractHttpConfigurer::disable)
				.httpBasic(AbstractHttpConfigurer::disable)
				.cors().and()
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
				.authorizeRequests(auth -> auth
						.expressionHandler(expressionHandler)
						.mvcMatchers(SecurityPathPatterns.PUBLIC_ENDPOINTS)
						.permitAll()
						.mvcMatchers(SecurityPathPatterns.ADMIN_ENDPOINTS).hasRole("ADMIN")
						.mvcMatchers(SecurityPathPatterns.USER_ADMIN_ENDPOINTS)
						.hasAnyRole("USER", "ADMIN")
						.mvcMatchers(SecurityPathPatterns.USER_AGU_ENDPOINTS)
						.hasAnyRole("USER", "AGU")
						.anyRequest().hasRole("USER")
				)
				.oauth2Login(oauth -> oauth
						.userInfoEndpoint(user -> user.userService(customOAuth2UserService))
						.successHandler(customSuccessHandler)
				)
				.logout(logout -> logout
						.logoutUrl("/v5/auth/logout")
						.logoutSuccessHandler(logoutHandler)
						.invalidateHttpSession(true)
						.clearAuthentication(true)
				)
				.addFilterBefore(loggingFilter, SecurityContextHolderFilter.class)
				.addFilterBefore(jwtAuthenticationFilter,
						UsernamePasswordAuthenticationFilter.class)
				.addFilterBefore(jwtExceptionFilter, JwtAuthenticationFilter.class)
				.exceptionHandling(handler -> handler
						.authenticationEntryPoint(entryPoint)
						.accessDeniedHandler(accessDeniedHandler))
		;

		return http.build();
	}
}
