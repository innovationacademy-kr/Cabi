package org.ftclub.cabinet.auth;

import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@Aspect
@RequiredArgsConstructor
public class UserAspect {

	//private final UserMapper ...
	//private final UserService ...
	//컨트롤러가 아니므로 Facade를 주입받지는 않지만, 서비스와 매퍼를 주입받아서 UserSessionDto를 생성해 줌.
	private final CookieManager cookieManager;
	private final TokenValidator tokenValidator;
	private final JwtProperties jwtProperties;

	@Around("execution(* *(.., @User (*), ..))")
	public Object setUserSessionDto(ProceedingJoinPoint joinPoint)
			throws Throwable {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		Object[] args = joinPoint.getArgs();
		args[0] = getUserSessionDtoByRequest(request);
		return joinPoint.proceed(args);
	}

	public UserSessionDto getUserSessionDtoByRequest(HttpServletRequest req) {
		String name = tokenValidator.getPayloadJson(
						cookieManager.getCookie(req, jwtProperties.getMainTokenName())).get("name")
				.toString();
		//To-Do: name을 기준으로 service에게 정보를 받고, 매핑한다.
		return new UserSessionDto(1L, name, "userEmail", 1, 1, new Date(), true);
	}
}
