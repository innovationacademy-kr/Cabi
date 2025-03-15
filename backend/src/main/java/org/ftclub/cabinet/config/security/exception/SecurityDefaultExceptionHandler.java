package org.ftclub.cabinet.config.security.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.http.MediaType;

/**
 * 예외 response 를 만들어 응답
 */
public class SecurityDefaultExceptionHandler implements SecurityExceptionHandler {

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public void handle(HttpServletResponse res, ExceptionStatus status) throws IOException {
		res.setStatus(status.getStatusCode());
		res.setContentType(MediaType.APPLICATION_JSON_VALUE);

		Map<String, Object> errResponse = new HashMap<>();
		errResponse.put("status", status.getStatusCode());
		errResponse.put("message", status.getMessage());
		errResponse.put("error", status.getError());
		errResponse.put("timestamp", Instant.now().toString());

		objectMapper.writeValue(res.getWriter(), errResponse);
	}
}
