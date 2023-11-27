package org.ftclub.cabinet.exception;

/**
 * Service에서 throw 하는 Exception 중 오류메세지를 커스텀 가능한 Exception
 * @see CustomExceptionStatus
 */
public class CustomServiceException extends RuntimeException {

    final CustomExceptionStatus status;

    /**
     * @param status exception에 대한 정보에 대한 enum
     */
    public CustomServiceException(CustomExceptionStatus status) {
        this.status = status;
    }

    public CustomExceptionStatus getStatus() {
        return status;
    }

    @Override
    public String getMessage() {
    	return status.getMessage();
    }
}
