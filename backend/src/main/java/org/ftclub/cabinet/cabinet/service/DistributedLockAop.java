package org.ftclub.cabinet.cabinet.service;

import java.lang.reflect.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.ftclub.cabinet.cabinet.domain.DistributedLock;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.client.RedisConnectionException;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class DistributedLockAop {

	private final RedissonClient redissonClient;
	private final TransactionAspect transactionAspect;
	private final CabinetQueryService cabinetQueryService;

	@Around("@annotation(org.ftclub.cabinet.cabinet.domain.DistributedLock) && args(targetId)")
	public Object applyDistributedLock(ProceedingJoinPoint joinPoint, Long targetId)
			throws Throwable {
		MethodSignature signature = (MethodSignature) joinPoint.getSignature();
		Method method = signature.getMethod();
		DistributedLock annotation = method.getAnnotation(DistributedLock.class);

		String key = getLockName(targetId, annotation);
		RLock lock = redissonClient.getLock(key);

		log.info("lock 획득 시도 : {}", key);
		try {
			boolean available = lock.tryLock(annotation.waitTime(), annotation.leaseTime(),
					annotation.timeUnit());
			if (!available) {

				log.error("Lock 획득 실패, {}", key);
				throw ExceptionStatus.LOCK_ACQUISITION_FAILED.asServiceException();
			}

			log.info("lock 획득 성공, {}", key);
			return transactionAspect.proceed(joinPoint);
		} catch (RedisConnectionException e) {
			return handleWithXLockFallback(joinPoint, targetId, annotation.lockName());
		} finally {
			try {
				lock.unlock();
			} catch (IllegalMonitorStateException e) {
				// leaseTime 지난 후 자동해제가 되는데 unlock 시도 시 발생
				log.error("Lock 반납 오류 (이미 만료): {}{}", e, key);
			}
		}
	}

	/**
	 * Redis 서버 장애로 분산락 실패 시 기존 X Lock 수행(Cabinet)
	 *
	 * @param joinPoint
	 * @return
	 * @throws Throwable
	 */
	private Object handleWithXLockFallback(ProceedingJoinPoint joinPoint, Object pkValue,
			String entityName)
			throws Throwable {
		if (entityName.equals("CABINET_LENT")) {
			cabinetQueryService.getCabinetForUpdate((Long) pkValue);
		}

		return joinPoint.proceed();
	}

	private String getLockName(Long targetId, DistributedLock annotation) {
		String lockNameFormat = "%s:%s_lock";
		String relevantParam = targetId.toString();

		return String.format(lockNameFormat, relevantParam, annotation.lockName());
	}

}
