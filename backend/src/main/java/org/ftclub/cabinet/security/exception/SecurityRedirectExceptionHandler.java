package org.ftclub.cabinet.security.exception;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * 예외 발생 시 쿼리에 예외 상황을 담아 redirect 수행
 */
@RequiredArgsConstructor
public class SecurityRedirectExceptionHandler implements SecurityExceptionHandler {

	private final AuthPolicyService authPolicyService;

	@Override
	public void handle(HttpServletResponse res, ExceptionStatus status) throws IOException {
		String uri = UriComponentsBuilder.fromHttpUrl(authPolicyService.getLoginUrl())
				.queryParam("code", status.getError())
				.queryParam("status", status.getStatusCode())
				.queryParam("message", status.name())
				.encode(StandardCharsets.UTF_8)
				.toUriString();

		res.sendRedirect(uri);
	}
}
