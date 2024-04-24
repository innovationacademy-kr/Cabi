package org.ftclub.cabinet.alarm.discord;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.util.ContentCachingRequestWrapper;

@Builder
@Getter
public class DiscordWebAlarmMessage {

	private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
			"yyyy-MM-dd HH:mm:ss");
	private final String subject;
	private final String requestURI;
	private final String httpMethod;
	private final String headers;
	private final String body;
	private final String parameters;
	private final String responseBody;

	public static DiscordWebAlarmMessage fromHttpServletRequest(HttpServletRequest request,
			String subject,
			String responseBody) {
		String requestBody = "";
		if (request instanceof ContentCachingRequestWrapper) {
			byte[] buf = ((ContentCachingRequestWrapper) request).getContentAsByteArray();
			requestBody = new String(buf, 0, buf.length, StandardCharsets.UTF_8).trim();
		}

		String headers = Collections.list(request.getHeaderNames())
				.stream()
				.collect(Collectors.toMap(h -> h, request::getHeader))
				.entrySet()
				.stream()
				.map(entry -> "\"" + entry.getKey() + "\":\"" + entry.getValue() + "\"")
				.collect(Collectors.joining(", ", "{", "}"));

		String params = request.getParameterMap().entrySet()
				.stream()
				.map(entry -> "\"" + entry.getKey() + "\":\"" + Arrays.toString(entry.getValue())
						+ "\"")
				.collect(Collectors.joining(", ", "{", "}"));

		return DiscordWebAlarmMessage.builder()
				.subject(subject)
				.requestURI(request.getRequestURI())
				.httpMethod(request.getMethod())
				.headers(headers)
				.body(requestBody)
				.parameters(params)
				.responseBody(responseBody)
				.build();
	}

	public static DiscordWebAlarmMessage fromWebRequest(WebRequest request, String subject,
			String responseBody) {
		if (request instanceof ServletWebRequest) {
			HttpServletRequest servletRequest = ((ServletWebRequest) request).getRequest();
			return fromHttpServletRequest(servletRequest, subject, responseBody);
		} else {
			String params = request.getParameterMap().entrySet().stream()
					.map(entry -> entry.getKey() + "=" + String.join(", ", entry.getValue()))
					.reduce((p1, p2) -> p1 + "; " + p2)
					.orElse("No parameters");

			String method = request.getHeader("X-HTTP-Method-Override"); // 클라이언트가 메서드를 오버라이드 했을 경우
			if (method == null) {
				method = request.getHeader("Method");
			}

			return DiscordWebAlarmMessage.builder()
					.subject(subject)
					.requestURI(request.getContextPath())
					.httpMethod(method)
					.parameters(params)
					.responseBody(responseBody)
					.build();
		}
	}

	@Override
	public String toString() {
		return "```java\n" +
				"Subject: \"" + subject + "\"\n" +
				"Issued at: \"" + LocalDateTime.now().format(formatter) + "\"\n" +
				"Request URI: \"" + requestURI + "\"\n" +
				"HTTP Method: \"" + httpMethod + "\"\n" +
				"Request Headers: \"" + headers + "\"\n" +
				"Request Body: \"" + body + "\"\n" +
				"Request Parameters: \"" + parameters + "\"\n" +
				"Response Body: \"" + responseBody + "\"\n" +
				"```";
	}
}
