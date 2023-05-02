package org.ftclub.cabinet.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Log4j2
@RestControllerAdvice
public class ExceptionController {

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<?> serviceExceptionHandler(ServiceException e) {
        log.info("called ExceptionController for {}", e.status.getError());
        return ResponseEntity
                .status(e.status.getStatusCode())
                .body(e.status);
    }
}
