package org.ftclub.cabinet.log;

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
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.alarm.discord.DiscordAlarmMessage;
import org.ftclub.cabinet.alarm.discord.DiscordWebHookMessenger;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.springframework.context.annotation.Profile;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 어드민 유저가 Get 요청을 제외한 API 호출 시 로그를 남기는 Aspect
 */
@Slf4j
@Aspect
@Component
@Profile({"prod", "dev"})
@RequiredArgsConstructor
public class AdminApiLogAspect {

	private final static String ADMIN_CUD_POINTCUT =
			"@target(org.springframework.web.bind.annotation.RestController) && " +
					"!@annotation(org.springframework.web.bind.annotation.GetMapping) && " +
					"within(org.ftclub.cabinet.admin..controller.*)"; // 특정 패키지로 제한
	private final ParameterNameDiscoverer discoverer = new DefaultParameterNameDiscoverer();
	private final LogParser logParser;
	private final DiscordWebHookMessenger discordWebHookMessenger;
	private final AdminQueryService adminQueryService;

	/**
	 * 어드민 유저가 Get 요청을 제외한 API 호출 및 요청 정상 처리 시 로그를 남기는 메소드
	 *
	 * @param joinPoint joinPoint 객체
	 * @param ret       API 호출의 응답 객체
	 * @throws JsonProcessingException Discord WebHook 메시지를 JSON으로 변환하는 과정에서 발생할 수 있는 예외
	 */
	@AfterReturning(pointcut = ADMIN_CUD_POINTCUT,
			returning = "ret", argNames = "joinPoint,ret")
	public void adminApiSuccessLog(JoinPoint joinPoint, Object ret)
			throws JsonProcessingException {
		sendLogMessage(joinPoint, ret == null ? "void" : ret.toString());
	}

	/**
	 * 어드민 유저가 Get 요청을 제외한 API 호출 및 요청 실패(예외) 시 로그를 남기는 메소드
	 *
	 * @param joinPoint joinPoint 객체
	 * @param exception API 호출의 예외 객체
	 * @throws JsonProcessingException Discord WebHook 메시지를 JSON으로 변환하는 과정에서 발생할 수 있는 예외
	 */
	@AfterThrowing(pointcut = ADMIN_CUD_POINTCUT, throwing = "exception")
	public void adminApiThrowingLog(JoinPoint joinPoint, Exception exception)
			throws JsonProcessingException {
		String responseString =
				exception.getClass().getName() + ":{" + exception.getMessage() + "}";
		sendLogMessage(joinPoint, responseString);
	}

	/**
	 * joinPoint 객체와 HttpServletRequest로부터 로그 메시지를 생성해서, Discord WebHook으로 전송하고 로그를 남기는 메소드
	 *
	 * @param joinPoint      joinPoint 객체
	 * @param responseString API 호출의 결과를 저장한 문자열
	 * @throws JsonProcessingException Discord WebHook 메시지를 JSON으로 변환하는 과정에서 발생할 수 있는 예외
	 */
	private void sendLogMessage(JoinPoint joinPoint, String responseString) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof UserInfoDto)) {
			return;
		}
		UserInfoDto adminInfoFromToken
				= (UserInfoDto) authentication.getPrincipal();
		if (!adminInfoFromToken.isAdmin()) {
			return;
		}

		// 어드민 계정의 이메일 (발생된 로그를 실행한 주체)
		String name = adminInfoFromToken.getEmail();

		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();

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
				if (args[i] != null) {
					sb.append(args[i].toString()).append("}&");
				}
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
