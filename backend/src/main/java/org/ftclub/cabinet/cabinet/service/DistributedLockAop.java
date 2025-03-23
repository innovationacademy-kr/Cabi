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
	private final CabinetQueryService cabinetQueryService;

	@Around("@annotation(org.ftclub.cabinet.cabinet.domain.DistributedLock)")
	public Object applyDistributedLock(ProceedingJoinPoint joinPoint) throws Throwable {
		MethodSignature signature = (MethodSignature) joinPoint.getSignature();
		Method method = signature.getMethod();
		DistributedLock annotation = method.getAnnotation(DistributedLock.class);

		Long value = (Long) CustomSpringEPLParser.getDynamicValue(signature.getParameterNames(),
				joinPoint.getArgs(), annotation.pk());
		String key = value + ":" + annotation.entity();
		RLock fairLock = redissonClient.getLock(key);

		boolean isAcquired = false;
		log.info("lock 획득 시도 : {}", key);
		try {
			isAcquired = fairLock.tryLock(annotation.waitTime(), annotation.leaseTime(),
					annotation.timeUnit());
			if (!isAcquired) {

				log.error("Lock 획득 실패, {}", key);
				throw ExceptionStatus.LOCK_ACQUISITION_FAILED.asServiceException();
			}
			log.info("lock 획득 성공, {}", key);

			return joinPoint.proceed();
		} catch (RedisConnectionException e) {
			return handleWithXLockFallback(joinPoint, value, annotation.entity());
		} finally {
			try {
				if (isAcquired && fairLock.isHeldByCurrentThread()) {
					log.info("lock 반납, {}", key);
					fairLock.unlock();
				}
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
		if (entityName.equals("CABINET")) {
			cabinetQueryService.getCabinetForUpdate((Long) pkValue);
		}

		return joinPoint.proceed();
	}

}
