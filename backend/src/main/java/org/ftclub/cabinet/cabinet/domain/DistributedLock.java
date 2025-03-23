package org.ftclub.cabinet.cabinet.domain;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

/**
 * 분산 락 수행 어노테이션 정의
 * <p>
 * entity, pk 값은 필수
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {

	/**
	 * Lock을 걸 Entity 이름
	 *
	 * @return
	 */
	String entity();

	/**
	 * 해당 entity에서 특정할 수 있는 PK
	 *
	 * @return
	 */
	String pk();

	/**
	 * Lock 시간 단위 - 기본 :초
	 *
	 * @return
	 */
	TimeUnit timeUnit() default TimeUnit.MILLISECONDS;

	/**
	 * Lock 획득을 위한 대기시간
	 *
	 * @return
	 */
	long waitTime() default 500L;

	/**
	 * Lock 임대 시간
	 *
	 * @return
	 */
	long leaseTime() default 1000L;

	/**
	 * 분산락 사용 시 트랜잭션 컨텍스트 필수 여부
	 *
	 * @return
	 */
	boolean requiresTransaction() default true;
}
