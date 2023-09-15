package org.ftclub.cabinet.log;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenValidator;
import org.ftclub.cabinet.config.JwtProperties;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Objects;

import static org.ftclub.cabinet.auth.domain.AuthLevel.USER_ONLY;
import static org.ftclub.cabinet.auth.domain.AuthLevel.USER_OR_ADMIN;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AdminApiLogAspect {

	private final static String ADMIN_CUD_POINTCUT = "@annotation(authGuard) && !@annotation(org.springframework.web.bind.annotation.GetMapping))";
	private final ParameterNameDiscoverer discoverer = new DefaultParameterNameDiscoverer();
	private final CookieManager cookieManager;
	private final TokenValidator tokenValidator;
	private final JwtProperties jwtProperties;
	private final LogParser logParser;

	@AfterReturning(
			pointcut = ADMIN_CUD_POINTCUT,
			returning = "ret", argNames = "joinPoint,authGuard,ret")
	public void adminApiSuccessLog(JoinPoint joinPoint, AuthGuard authGuard, Object ret)
			throws JsonProcessingException {
		AuthLevel level = authGuard.level();
		if (level.equals(USER_ONLY) || level.equals(USER_OR_ADMIN)) {
			return;
		}
		String responseString = (ret == null) ? "void" : ret.toString();
		sendLogMessage(joinPoint, responseString);
	}

	@AfterThrowing(
			pointcut = ADMIN_CUD_POINTCUT,
			throwing = "exception", argNames = "joinPoint,authGuard, exception")
	public void adminApiThrowingLog(JoinPoint joinPoint, AuthGuard authGuard, Exception exception)
			throws JsonProcessingException {
		AuthLevel level = authGuard.level();
		if (level.equals(USER_ONLY) || level.equals(USER_OR_ADMIN)) {
			return;
		}
		String responseString = exception.getClass().getName() + ":{" + exception.getMessage() + "}";
		sendLogMessage(joinPoint, responseString);
	}

	private void sendLogMessage(JoinPoint joinPoint, String responseString)
			throws JsonProcessingException {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();

		String name = tokenValidator.getPayloadJson(
						cookieManager.getCookieValue(request, jwtProperties.getAdminTokenName()))
				.get("email").asText();
		Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
		String className = joinPoint.getTarget().getClass().getName();
		String methodName = method.getName();
		Object[] args = joinPoint.getArgs();
		String[] parameterNames = discoverer.getParameterNames(method);

		StringBuilder sb = new StringBuilder();
		// 누가
		sb.append(name).append("#");
		// 어떤 메소드를
		sb.append(className).append("#")
				.append(request.getMethod()).append("#")
				.append(methodName).append("#");
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
		// 결과
		String message = sb.append(responseString).toString();
		
		logParser.parseToDiscordAlarmMessage(message);
		log.info(message);
	}
}
