package org.ftclub.cabinet.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.discord.DiscordWebAlarmMessage;
import org.ftclub.cabinet.alarm.discord.DiscordWebHookMessenger;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Log4j2
@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionController extends ResponseEntityExceptionHandler {

	private static final String DEFAULT_ERROR_MESSAGE_VALUE = "까비 서버에서 예기치 않은 오류가 발생했어요.🥲";
	private static final String SPRING_MVC_ERROR_MESSAGE_VALUE = "Spring MVC 에서 예기치 않은 오류가 발생했어요.🥲";
	private final DiscordWebHookMessenger discordWebHookMessenger;
	private final AuthPolicyService authPolicyService;
	@Value("${cabinet.local}")
	public boolean isLocal;

	@ExceptionHandler(ControllerException.class)
	public ResponseEntity<?> controllerExceptionHandler(ControllerException e) {
		log.info("[ControllerException] {} : {}", e.status.getError(), e.status.getMessage());
		if (log.isDebugEnabled()) {
			log.debug("Exception stack trace: ", e);
		}
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(ServiceException.class)
	public ResponseEntity<?> serviceExceptionHandler(ServiceException e) {
		log.info("[ServiceException] {} : {}", e.status.getError(), e.status.getMessage());
		if (log.isDebugEnabled()) {
			log.debug("Exception stack trace: ", e);
		}
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<?> accessDeniedExceptionHandler(AccessDeniedException e) {
		ExceptionStatus status = ExceptionStatus.FORBIDDEN_USER;
		log.info("[AccessDeniedException] : {} : {}", status.getError(), status.getMessage());
		if (log.isDebugEnabled()) {
			log.debug("Exception stack trace: ", e);
		}
		return ResponseEntity
				.status(status.getStatusCode())
				.body(status);
	}

	@ExceptionHandler(CustomServiceException.class)
	public ResponseEntity<?> customServiceExceptionHandler(CustomServiceException e) {
		log.info("[CustomServiceException] {} : {}", e.status.getError(), e.status.getMessage());
		if (log.isDebugEnabled()) {
			log.debug("Exception stack trace: ", e);
		}
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(DomainException.class)
	public ResponseEntity<?> domainExceptionHandler(DomainException e) {
		log.warn("[DomainException] {} : {}", e.status.getError(), e.status.getMessage());
		if (log.isDebugEnabled()) {
			log.debug("Exception stack trace: ", e);
		}
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(UtilException.class)
	public ResponseEntity<?> utilExceptionHandler(UtilException e) {
		log.warn("[UtilException] {} : {}", e.status.getError(), e.status.getMessage());
		if (log.isDebugEnabled()) {
			log.debug("Exception stack trace: ", e);
		}
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@NotNull
	@Override
	protected ResponseEntity<Object> handleExceptionInternal(
			@NotNull Exception e, Object body,
			@NotNull org.springframework.http.HttpHeaders headers,
			@NotNull org.springframework.http.HttpStatus status,
			@NotNull org.springframework.web.context.request.WebRequest request) {
		Map<String, Object> responseBody = new LinkedHashMap<>();
		String requestUri = request.getContextPath();  // requestURI 정보 설정
		responseBody.put("statusCode", status.value());
		responseBody.put("message", e.getMessage());
		responseBody.put("error", status.getReasonPhrase());

		if (status.is5xxServerError()) {
			responseBody.put("message", DEFAULT_ERROR_MESSAGE_VALUE);
			log.error("[SpringMVCException] {} : {} at {}",
					status.getReasonPhrase(), e.getMessage(), requestUri);
			log.error("Exception stack trace: ", e);
			if (!isLocal) {
				discordWebHookMessenger.sendMessage(
						DiscordWebAlarmMessage.fromWebRequest(
								request,
								SPRING_MVC_ERROR_MESSAGE_VALUE,
								responseBody.toString()
						)
				);
			}
		} else {
			log.warn("[SpringMVCException] {} : {} at {}",
					status.getReasonPhrase(), e.getMessage(), requestUri);
		}
		return ResponseEntity.status(status).headers(headers).body(responseBody);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleInternalServerErrorException(Exception e,
			HttpServletRequest request) {
		log.error("[UncheckedException] {} for request URL: {}", e.getMessage(),
				request.getRequestURL());
		log.error("Exception stack trace: ", e);

		Map<String, Object> responseBody = new LinkedHashMap<>();
		responseBody.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
		responseBody.put("message", DEFAULT_ERROR_MESSAGE_VALUE);
		responseBody.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());

		if (!isLocal) {
			discordWebHookMessenger.sendMessage(
					DiscordWebAlarmMessage.fromHttpServletRequest(
							request,
							DEFAULT_ERROR_MESSAGE_VALUE,
							responseBody.toString()
					)
			);
		}
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
	}
}
