package org.ftclub.cabinet.user.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.time.LocalDateTime;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.service.TokenValidator;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@Aspect
@RequiredArgsConstructor
@Log4j2
public class UserAspect {

	//private final UserMapper ...
	//private final UserService ...
	//컨트롤러가 아니므로 Facade를 주입받지는 않지만, 서비스와 매퍼를 주입받아서 UserSessionDto를 생성해 줌.
	private final CookieManager cookieManager;
	private final TokenValidator tokenValidator;
	private final JwtProperties jwtProperties;
	private final UserQueryService userQueryService;

	@Around("execution(* *(.., @UserSession (*), ..))")
	public Object setUserSessionDto(ProceedingJoinPoint joinPoint)
			throws Throwable {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		//@User를 쓰려면 반드시 첫 매개변수에 UserSessionDto로 설정해주어야 함.
		Object[] args = joinPoint.getArgs();
		if (!args[0].getClass().equals(UserSessionDto.class)) {
			log.error("User not found");
			throw ExceptionStatus.UNAUTHORIZED.asControllerException();
		}
		args[0] = getUserSessionDtoByRequest(request);
		return joinPoint.proceed(args);
	}

	// ToDo: 수정 필요
	public UserSessionDto getUserSessionDtoByRequest(HttpServletRequest req)
			throws JsonProcessingException {
		String name = tokenValidator.getPayloadJson(
						cookieManager.getCookieValue(req, jwtProperties.getMainTokenName())).get("name")
				.asText();
		User user = userQueryService.findUserByName(name)
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
		//ToDo: name을 기준으로 service에게 정보를 받고, 매핑한다.
		// name과 email은 우선 구현했으나 수정이 필요함.
		return new UserSessionDto(user.getId(), name, user.getEmail(), 1, 1, LocalDateTime.now(),
				true);
	}
}
