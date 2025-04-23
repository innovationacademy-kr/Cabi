package org.ftclub.cabinet.cabinet.service;

import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TransactionAspect {

	/**
	 * leaseTime 보다, 트랜잭션 타임아웃을 작게 설정합니다.
	 * <p>
	 * leaseTimeOut 발생 이전에 rollback을 시키기 위함.
	 *
	 * @param joinPoint
	 * @return
	 * @throws Throwable
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW, timeout = 2)
	public Object proceed(final ProceedingJoinPoint joinPoint) throws Throwable {
		return joinPoint.proceed();
	}
}
