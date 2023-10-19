package org.ftclub.cabinet.log;

import static org.ftclub.cabinet.auth.domain.AuthLevel.USER_ONLY;
import static org.ftclub.cabinet.auth.domain.AuthLevel.USER_OR_ADMIN;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.lang.reflect.Method;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.ftclub.cabinet.alarm.discord.DiscordAlarmMessage;
import org.ftclub.cabinet.alarm.discord.DiscordWebHookMessenger;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenValidator;
import org.ftclub.cabinet.config.JwtProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 어드민 유저가 Get 요청을 제외한 API 호출 시 로그를 남기는 Aspect
 */
@Slf4j
@Aspect
@Component
@Profile("prod")
@RequiredArgsConstructor
public class AdminApiLogAspect {

	private final static String ADMIN_CUD_POINTCUT = "@annotation(authGuard) && !@annotation(org.springframework.web.bind.annotation.GetMapping))";
	private final ParameterNameDiscoverer discoverer = new DefaultParameterNameDiscoverer();
	private final CookieManager cookieManager;
	private final TokenValidator tokenValidator;
	private final JwtProperties jwtProperties;
	private final LogParser logParser;
	private final DiscordWebHookMessenger discordWebHookMessenger;

	/**
	 * 어드민 유저가 Get 요청을 제외한 API 호출 및 요청 정상 처리 시 로그를 남기는 메소드
	 * @param joinPoint joinPoint 객체
	 * @param authGuard 어드민 유저를 판단하기 위한 AuthGuard 어노테이션
	 * @param ret API 호출의 응답 객체
	 * @throws JsonProcessingException Discord WebHook 메시지를 JSON으로 변환하는 과정에서 발생할 수 있는 예외
	 */
	@AfterReturning(pointcut = ADMIN_CUD_POINTCUT,
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

	/**
	 * 어드민 유저가 Get 요청을 제외한 API 호출 및 요청 실패(예외) 시 로그를 남기는 메소드
	 * @param joinPoint joinPoint 객체
	 * @param authGuard 어드민 유저를 판단하기 위한 AuthGuard 어노테이션
	 * @param exception API 호출의 예외 객체
	 * @throws JsonProcessingException Discord WebHook 메시지를 JSON으로 변환하는 과정에서 발생할 수 있는 예외
	 */
	@AfterThrowing(pointcut = ADMIN_CUD_POINTCUT,
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

	/**
	 * joinPoint 객체와 HttpServletRequest로부터 로그 메시지를 생성해서, Discord WebHook으로 전송하고 로그를 남기는 메소드
	 * @param joinPoint joinPoint 객체
	 * @param responseString API 호출의 결과를 저장한 문자열
	 * @throws JsonProcessingException Discord WebHook 메시지를 JSON으로 변환하는 과정에서 발생할 수 있는 예외
	 */
	private void sendLogMessage(JoinPoint joinPoint, String responseString) throws JsonProcessingException {
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
		// 어드민 사용자
		sb.append(name).append("#");
		// 메소드
		sb.append(className).append("#")
				.append(request.getMethod()).append("#")
				.append(methodName).append("#");
		// 파라미터
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

		DiscordAlarmMessage discordAlarmMessage = logParser.parseToDiscordAlarmMessage(message);
		discordWebHookMessenger.sendMessage(discordAlarmMessage);
		log.info(message);
	}
}
