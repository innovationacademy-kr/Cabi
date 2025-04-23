package org.ftclub.cabinet.cabinet.domain;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

/**
 * 분산 락 수행 어노테이션 정의 entity, pk 값은 필수
 * <p>
 * leaseTime -> 락 획득 후 수행할 작업 요소시간보다 약간 길게,
 * <p>
 * waitTime은 leaseTime보다 길게 설정한다.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {

	/**
	 * Lock을 걸 Entity 이름
	 *
	 * @return
	 */
	String lockName();

	/**
	 * Lock 시간 단위 - 기본 :초
	 *
	 * @return
	 */
	TimeUnit timeUnit() default TimeUnit.SECONDS;

	/**
	 * Lock 획득을 위한 대기시간
	 *
	 * @return
	 */
	long waitTime() default 5L;

	/**
	 * Lock 임대 시간
	 *
	 * @return
	 */
	long leaseTime() default 3L;
}
