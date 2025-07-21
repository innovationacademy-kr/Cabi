package org.ftclub.cabinet.security;

import java.util.LinkedHashMap;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.security.filter.JwtAuthenticationFilter;
import org.ftclub.cabinet.security.filter.JwtExceptionFilter;
import org.ftclub.cabinet.security.filter.LoggingFilter;
import org.ftclub.cabinet.security.handler.CustomAccessDeniedHandler;
import org.ftclub.cabinet.security.handler.CustomAuthenticationEntryPoint;
import org.ftclub.cabinet.security.handler.CustomAuthorizationRequestResolver;
import org.ftclub.cabinet.security.handler.CustomOAuth2UserService;
import org.ftclub.cabinet.security.handler.CustomUnauthorizedAuthenticationEntryPoint;
import org.ftclub.cabinet.security.handler.CustomSuccessHandler;
import org.ftclub.cabinet.security.handler.LogoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.DelegatingAuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

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
	private final CustomAuthenticationEntryPoint defaultEntryPoint;
	private final CustomUnauthorizedAuthenticationEntryPoint unauthorizedEntryPoint;
	private final CustomAccessDeniedHandler accessDeniedHandler;
	private final LogoutHandler logoutHandler;
	private final CustomAuthorizationRequestResolver requestResolver;

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
						.mvcMatchers(SecurityPathPatterns.PUBLIC_ENDPOINTS)
						.permitAll()
						.mvcMatchers(SecurityPathPatterns.ADMIN_ENDPOINTS)
						.hasAnyRole("ADMIN", "MASTER")
						.antMatchers(SecurityPathPatterns.ADMIN_USER_ENDPOINTS)
						.hasAnyRole("USER", "ADMIN", "MASTER")
						.mvcMatchers(SecurityPathPatterns.AGU_ENDPOINTS)
						.hasAnyRole("AGU", "USER")
						.mvcMatchers(HttpMethod.GET, SecurityPathPatterns.NON_ANONYMOUS_ENDPOINTS)
						.hasRole("USER")
						.mvcMatchers(HttpMethod.GET, SecurityPathPatterns.ANONYMOUS_ENDPOINTS)
						.hasAnyRole("ANONYMOUS", "USER")
						.anyRequest().hasRole("USER")
				)
				.oauth2Login(oauth -> oauth
						.authorizationEndpoint(auth -> auth
								.authorizationRequestResolver(requestResolver))
						.userInfoEndpoint(user -> user.userService(customOAuth2UserService))
						.successHandler(customSuccessHandler)
				)
				.logout(logout -> logout
						.logoutUrl("/logout")
						.logoutSuccessHandler(logoutHandler)
						.invalidateHttpSession(true)
						.clearAuthentication(true)
				)
				.addFilterBefore(loggingFilter, SecurityContextHolderFilter.class)
				.addFilterBefore(jwtAuthenticationFilter,
						UsernamePasswordAuthenticationFilter.class)
				.addFilterBefore(jwtExceptionFilter, JwtAuthenticationFilter.class)
				.exceptionHandling(handler -> handler
						.authenticationEntryPoint(delegatingEntryPoint())
						.accessDeniedHandler(accessDeniedHandler))
		;

		return http.build();
	}

	/**
	 * 요청 경로에 따라 다른 AuthenticationEntryPoint를 선택하여 반환하는 DelegatingAuthenticationEntryPoint를 생성합니다. 이
	 * EntryPoint는 인증되지 않은 사용자가 보호된 리소스에 접근할 때 적절한 예외를 발생시키기 위해 사용됩니다.
	 *
	 * @return DelegatingAuthenticationEntryPoint
	 */
	@Bean
	public AuthenticationEntryPoint delegatingEntryPoint() {
		LinkedHashMap<RequestMatcher, AuthenticationEntryPoint> entryPoints = new LinkedHashMap<>();

		for (String path : SecurityPathPatterns.ANONYMOUS_ENDPOINTS) {
			entryPoints.put(new AntPathRequestMatcher(path), unauthorizedEntryPoint);
		}

		DelegatingAuthenticationEntryPoint delegatingEntryPoint =
				new DelegatingAuthenticationEntryPoint(entryPoints);
		// 기본 entryPoint를 설정.
		delegatingEntryPoint.setDefaultEntryPoint(defaultEntryPoint);

		return delegatingEntryPoint;
	}
}
