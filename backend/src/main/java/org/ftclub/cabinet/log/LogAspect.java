package org.ftclub.cabinet.log;

import java.lang.reflect.Method;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class LogAspect {

	private final ParameterNameDiscoverer discoverer = new DefaultParameterNameDiscoverer();

	@Before(value = "@within(logging)", argNames = "joinPoint,logging")
	public void classLogAdvice(JoinPoint joinPoint, Logging logging) {
		if (logging != null && isLogEnabled(logging.level())) {
			String message = parseMessage(joinPoint);
			printLog(logging.level(), message);
		}
	}

	@Before(value = "@annotation(logging)", argNames = "joinPoint,logging")
	public void methodLogAdvice(JoinPoint joinPoint, Logging logging) {
		if (logging != null && isLogEnabled(logging.level())) {
			String message = parseMessage(joinPoint);
			printLog(logging.level(), message);
		}
	}

	private boolean isLogEnabled(LogLevel level) {
		switch (level) {
			case TRACE:
				return log.isTraceEnabled();
			case DEBUG:
				return log.isDebugEnabled();
			case WARN:
				return log.isWarnEnabled();
			case ERROR:
				return log.isErrorEnabled();
			default:
				return log.isInfoEnabled();
		}
	}

	private void printLog(LogLevel level, String message) {
		switch (level) {
			case TRACE:
				log.trace(message);
				break;
			case DEBUG:
				log.debug(message);
				break;
			case WARN:
				log.warn(message);
				break;
			case ERROR:
				log.error(message);
				break;
			default:
				log.info(message);
				break;
		}
	}

	private String parseMessage(JoinPoint joinPoint) {
		String[] classPath = joinPoint.getSignature().getDeclaringType().getName().split("\\.");
		String callerClass = classPath[classPath.length - 1];
		Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
		String methodName = method.getName();
		Object[] args = joinPoint.getArgs();
		String[] parameterNames = discoverer.getParameterNames(method);

		StringBuilder sb = new StringBuilder();
		sb.append(callerClass).append(" - ");
		sb.append("Called ").append(methodName).append(" ");
		if (Objects.nonNull(parameterNames)) {
			for (int i = 0; i < args.length; i++) {
				sb.append(parameterNames[i]).append(": ").append(args[i]).append(", ");
			}
		}
		sb.delete(sb.length() - 2, sb.length() - 1);
		return sb.toString();
	}
}
