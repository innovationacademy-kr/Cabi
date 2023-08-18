package org.ftclub.cabinet.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Log4j2
@RestControllerAdvice
public class ExceptionController {

	@ExceptionHandler(ControllerException.class)
	public ResponseEntity<?> controllerExceptionHandler(ControllerException e) {
		log.info("[ControllerException] {} : {}", e.status.getError(), e.status.getMessage());
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(ServiceException.class)
	public ResponseEntity<?> serviceExceptionHandler(ServiceException e) {
		log.info("[ServiceException] {} : {}", e.status.getError(), e.status.getMessage());
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(CustomServiceException.class)
	public ResponseEntity<?> customServiceExceptionHandler(CustomServiceException e) {
		log.info("[CustomServiceException] {} : {}", e.status.getError(), e.status.getMessage());
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(DomainException.class)
	public ResponseEntity<?> domainExceptionHandler(DomainException e) {
		log.warn("[DomainException] {} : {}", e.status.getError(), e.status.getMessage());
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

	@ExceptionHandler(UtilException.class)
	public ResponseEntity<?> utilExceptionHandler(UtilException e) {
		log.warn("[UtilException] {} : {}", e.status.getError(), e.status.getMessage());
		return ResponseEntity
				.status(e.status.getStatusCode())
				.body(e.status);
	}

}
