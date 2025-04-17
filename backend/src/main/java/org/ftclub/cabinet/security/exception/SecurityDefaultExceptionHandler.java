package org.ftclub.cabinet.security.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.Logging;
import org.springframework.http.MediaType;

/**
 * 예외 response 를 만들어 응답
 */
@Logging
public class SecurityDefaultExceptionHandler implements SecurityExceptionHandler {

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public void handle(HttpServletResponse res, ExceptionStatus status) throws IOException {
		res.setStatus(status.getStatusCode());
		res.setCharacterEncoding("UTF-8");
		res.setContentType(MediaType.APPLICATION_JSON_VALUE);

		Map<String, Object> errResponse = new HashMap<>();
		errResponse.put("status", status.getStatusCode());
		errResponse.put("message", status.getMessage());
		errResponse.put("error", status.getError());
		errResponse.put("timestamp", Instant.now().toString());

		objectMapper.writeValue(res.getWriter(), errResponse);
	}
}
