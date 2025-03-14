package org.ftclub.cabinet.config.security;

import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.ftclub.cabinet.auth.service.CookieService;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Service("securityPathPolicy")
@RequiredArgsConstructor
public class SecurityPathPolicyService {


	private final CookieService cookieService;

	public boolean isAguContext() {
		return isPathContext("/agu");
	}


	/**
	 * Oauth 로그인 후, 최초 요청 위치가 /admin 도메인인지 검수합니다.
	 * <p>
	 * oauth 로그인 수행 시, redirect 수행되므로 cookie에서 값을 통해 확인
	 *
	 * @return
	 */
	public boolean isAdminContext() {
		HttpServletRequest request = getCurrentHttpRequest();
		String loginSource = cookieService.getCookieValue(request, "login_source");

		return loginSource != null && loginSource.equals("admin");
	}

	/**
	 * 요청한 도메인과 path를 비교합니다.
	 *
	 * @param path
	 * @return
	 */
	private boolean isPathContext(String path) {
		HttpServletRequest request = getCurrentHttpRequest();
		if (request == null) {
			return false;
		}

		String origin = request.getHeader("Origin");
		String referer = request.getHeader(HttpHeaders.REFERER);
		log.info("Origin = {}", origin);
		log.info("Referer = {}, RequestURI = {}, RequestURL = {}",
				referer, request.getRequestURI(), request.getRequestURL());

		log.info("Referer = {}", referer);
		String uri = request.getRequestURI();

		return (referer != null && (referer.contains(path) || uri.contains(path)));
	}

	/**
	 * 현재 요청에 대한 HttpServletRequest 를 securityContext에서 가져옵니다.
	 *
	 * @return
	 */
	private HttpServletRequest getCurrentHttpRequest() {
		ServletRequestAttributes attributes =
				(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if (attributes != null) {
			return attributes.getRequest();
		}

		return null;
	}
}
