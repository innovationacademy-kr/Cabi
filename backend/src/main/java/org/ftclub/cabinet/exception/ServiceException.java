package org.ftclub.cabinet.exception;

/**
 * Service에서 throw하는 exception들을 위한 exception 사용 예시:
 * <pre>
 *     {@code throw new ServiceException(ExceptionStatus.NOT_FOUND_USER);}
 * </pre>
 * 만약 새로운 exception을 만들 필요가 있다면 {@link ExceptionStatus}에서 새로운 enum값을 추가하면 된다.
 *
 * @see org.ftclub.cabinet.exception.ExceptionStatus
 */
public class ServiceException extends RuntimeException {

    final ExceptionStatus status;

    /**
     * @param status exception에 대한 정보에 대한 enum
     */
    public ServiceException(ExceptionStatus status) {
        this.status = status;
    }

    public ExceptionStatus getStatus() {
        return status;
    }
}
