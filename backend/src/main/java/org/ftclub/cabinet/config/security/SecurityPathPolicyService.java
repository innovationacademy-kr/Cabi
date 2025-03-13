package org.ftclub.cabinet.config.security;

import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Service("securityPathPolicy")
@RequiredArgsConstructor
public class SecurityPathPolicyService {


	public boolean isAguContext() {
		return isPathContext("/agu");
	}

	private boolean isPathContext(String path) {
		HttpServletRequest request = getCurrentHttpRequest();
		if (request == null) {
			return false;
		}

		String referer = request.getHeader(HttpHeaders.REFERER);
		log.info("Referer = {}", referer);
		String uri = request.getRequestURI();

		return (referer != null && (referer.contains(path) || uri.contains(path)));
	}

	private HttpServletRequest getCurrentHttpRequest() {
		ServletRequestAttributes attributes =
				(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if (attributes != null) {
			return attributes.getRequest();
		}

		return null;
	}
}
