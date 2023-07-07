package org.ftclub.cabinet.log;


import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenValidator;
import org.ftclub.cabinet.config.JwtProperties;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
@RequiredArgsConstructor
@Log4j2
public class AllRequestLogInterceptor implements HandlerInterceptor {

	private final static String USER_ID = "userId";
	private static final List<String> IP_HEADERS = Arrays.asList("X-Forwarded-For",
			"Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR");
	private final TokenValidator tokenValidator;
	private final CookieManager cookieManager;
	private final JwtProperties jwtProperties;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler) {
		MDC.put(USER_ID, getUserId(request));
		return true;
	}


	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) {
		String ip = getClientIpAddr(request);
		String action = request.getRequestURI();
		int status = response.getStatus();
		log.info("IP: {}, action: {}, status: {}", ip, action, status);
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
			Object handler, Exception ex) throws Exception {
		MDC.remove(USER_ID);
		MDC.clear();
	}

	private String getClientIpAddr(HttpServletRequest request) {
		return IP_HEADERS.stream()
				.map(request::getHeader)
				.filter(Objects::nonNull)
				.filter(ip -> !ip.isEmpty() && !ip.equalsIgnoreCase("unknown"))
				.findFirst()
				.orElseGet(request::getRemoteAddr);
	}

	private String getUserId(HttpServletRequest request) {
		String ret = null;
		try {
			ret = tokenValidator.getPayloadJson(
							cookieManager.getCookieValue(request, jwtProperties.getMainTokenName()))
					.get("name")
					.asText();
		} catch (Exception ignore) {
		}

		if (ret != null) {
			return ret;
		} else {
			String uuid = UUID.randomUUID().toString();
			return uuid.substring(uuid.length() - 12);
		}
	}
}