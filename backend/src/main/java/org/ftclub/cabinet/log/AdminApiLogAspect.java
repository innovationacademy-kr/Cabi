package org.ftclub.cabinet.log;

import java.lang.reflect.Method;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.springframework.context.annotation.Profile;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Profile("prod")
@Aspect
@Component
public class AdminApiLogAspect {

	private final ParameterNameDiscoverer discoverer = new DefaultParameterNameDiscoverer();

	@Pointcut("@annotation(authGuard) && "
			+ "!@annotation(org.springframework.web.bind.annotation.GetMapping)")
	public void adminApiLog(AuthGuard authGuard) {
	}

	@AfterReturning(pointcut = "adminApiLog(authGuard)", returning = "ret", argNames = "authGuard,joinPoint,ret")
	public void adminApiSuccessLog(
			AuthGuard authGuard,
			JoinPoint joinPoint,
			Object ret) {
		if (authGuard.level().equals(AuthLevel.USER_ONLY) || authGuard.level().equals(AuthLevel.USER_OR_ADMIN)) {
			return;
		}
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getResponse();

		Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
		String className = joinPoint.getTarget().getClass().getName();
		String methodName = method.getName();
		Object[] args = joinPoint.getArgs();
		String[] parameterNames = discoverer.getParameterNames(method);

		StringBuilder sb = new StringBuilder();
		// 누가
//		sb.append();
		// 어떤 메소드를
		sb.append(className).append("#").append(request.getMethod()).append("#").append(methodName).append("#");
		// 어떤 파라미터로
		if (Objects.nonNull(parameterNames)) {
			for (int i = 0; i < args.length; i++) {
				sb.append("{").append(parameterNames[i]).append("=");
				if (args[i] != null)
					sb.append(args[i].toString()).append("}&");
			}
		}
		if (args.length > 0) {
			sb.setLength(sb.length() - 1);
			sb.append("#");
		}
		// 어떤 결과를 반환 했는지
		if (ret != null) {
			sb.append(ret.toString());
		} else {
			sb.append("void");
		}

		String result = sb.toString();
	}

	@AfterThrowing
	public void adminApiThrowingLog(
			AuthGuard authGuard,
			JoinPoint joinPoint,
			Object ret) {
	}
}
