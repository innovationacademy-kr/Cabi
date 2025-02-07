package org.ftclub.cabinet.config.security;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final LoggingFilter loggingFilter;
	private final CustomSuccessHandler customSuccessHandler;
	private final AuthenticationEntryPoint entrypoint;
	private final CustomAccessDeniedHandler customAccessDeniedHandler;

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return web -> web.ignoring()
				.mvcMatchers("/error", "/favicon.ico");
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// security 에서 기본적으로 제공하는 로그인 폼 사용 안함 우리는 oauth 로그인 사용
		http.formLogin(AbstractHttpConfigurer::disable)
				.httpBasic(AbstractHttpConfigurer::disable)
				// api별 접근 권한을 부여합니다
				.authorizeHttpRequests(auth -> auth
						.mvcMatchers("/actuator/**", "/v4/auth/**", "/login/**").permitAll()
						.mvcMatchers("/v4/admin/**").hasRole(AdminRole.ADMIN.name())
						.mvcMatchers("/v4/users/me").hasRole(FtRole.USER.name())
				)
				.oauth2Login(oauth -> oauth
						.userInfoEndpoint(user -> user.userService(customOAuth2UserService))
						.successHandler(customSuccessHandler)
				)
				.addFilterAfter(jwtAuthenticationFilter,
						UsernamePasswordAuthenticationFilter.class)
				.addFilterAfter(loggingFilter, UsernamePasswordAuthenticationFilter.class)
				.exceptionHandling(handler -> handler.authenticationEntryPoint(entrypoint))
				.exceptionHandling(
						handler -> handler.accessDeniedHandler(customAccessDeniedHandler));

		return http.build();
	}
}
