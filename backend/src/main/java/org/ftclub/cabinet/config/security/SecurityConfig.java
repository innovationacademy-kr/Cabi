package org.ftclub.cabinet.config.security;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.security.filter.JwtAuthenticationFilter;
import org.ftclub.cabinet.config.security.filter.JwtExceptionFilter;
import org.ftclub.cabinet.config.security.filter.LoggingFilter;
import org.ftclub.cabinet.config.security.handler.CustomAccessDeniedHandler;
import org.ftclub.cabinet.config.security.handler.CustomAuthenticationEntryPoint;
import org.ftclub.cabinet.config.security.handler.CustomOAuth2UserService;
import org.ftclub.cabinet.config.security.handler.CustomSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextHolderFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final JwtExceptionFilter jwtExceptionFilter;
	private final LoggingFilter loggingFilter;
	private final CustomSuccessHandler customSuccessHandler;
	private final CustomAuthenticationEntryPoint entrypoint;
	private final CustomAccessDeniedHandler customAccessDeniedHandler;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http)
			throws Exception {
		// security 에서 기본적으로 제공하는 로그인 폼 사용 안함 우리는 oauth 로그인 사용
		http.csrf(AbstractHttpConfigurer::disable)
				.formLogin(AbstractHttpConfigurer::disable)
				.httpBasic(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
				// api별 접근 권한을 부여합니다
				.authorizeHttpRequests(auth -> auth
						.mvcMatchers("/ping", "/actuator/**", "/v4/auth/**", "/login/**",
								"/v5/jwt/reissue", "/v4/admin/auth/login")
						.permitAll()
						.mvcMatchers("/slack/**").hasRole("ADMIN")
						.mvcMatchers("/v4/admin/**").hasRole("ADMIN")
						.mvcMatchers("/v5/admin/**").hasRole("ADMIN")
						.mvcMatchers("/v4/cabinets/**").hasAnyRole("USER", "ADMIN")
						.mvcMatchers("/v4/lent/me").hasAnyRole("USER", "AGU")
						.antMatchers("/v4/lent/cabinets/share/cancel/*").hasAnyRole("USER", "ADMIN")
						.mvcMatchers("/v4/items").hasAnyRole("USER", "ADMIN")
						.anyRequest().hasRole("USER")
				)
				.oauth2Login(oauth -> oauth
						.userInfoEndpoint(user -> user.userService(customOAuth2UserService))
						.successHandler(customSuccessHandler)
				)
				.logout(logout -> logout
						.logoutUrl("/v4/auth/logout")
						.logoutSuccessHandler((request, response, authentication) ->
								response.setStatus(HttpStatus.OK.value()))
						.invalidateHttpSession(true)
						.clearAuthentication(true)
				)
				.addFilterBefore(loggingFilter, SecurityContextHolderFilter.class)
				.addFilterBefore(jwtAuthenticationFilter,
						UsernamePasswordAuthenticationFilter.class)
				.addFilterBefore(jwtExceptionFilter, JwtAuthenticationFilter.class)
				.exceptionHandling(handler -> handler
						.authenticationEntryPoint(entrypoint)
						.accessDeniedHandler(customAccessDeniedHandler))
		;

		return http.build();
	}
}
