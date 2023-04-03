package hello.hellospring.author;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class InvalidTokenException extends RuntimeException {
	public InvalidTokenException(String message) {
		super(message);
	}

	public ResponseEntity<String> getResponseEntity() {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getMessage());
	}
}
