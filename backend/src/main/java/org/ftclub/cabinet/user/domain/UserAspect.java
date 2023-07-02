package org.ftclub.cabinet.user.domain;

import com.fasterxml.jackson.core.JsonProcessingException;

import java.time.LocalDateTime;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenValidator;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.cabinet.user.service.UserService;
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
	private final UserOptionalFetcher userOptionalFetcher;
	private final UserService userService;

	@Around("execution(* *(.., @UserSession (*), ..))")
	public Object setUserSessionDto(ProceedingJoinPoint joinPoint)
			throws Throwable {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		//@User를 쓰려면 반드시 첫 매개변수에 UserSessionDto로 설정해주어야 함.
		Object[] args = joinPoint.getArgs();
		if (!args[0].getClass().equals(UserSessionDto.class)) {
			throw new ControllerException(ExceptionStatus.INTERNAL_SERVER_ERROR);
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
        User user = userOptionalFetcher.getUserByName(name);
        //ToDo: name을 기준으로 service에게 정보를 받고, 매핑한다.
        // name과 email은 우선 구현했으나 수정이 필요함.
        return new UserSessionDto(user.getUserId(), name, user.getEmail(), 1, 1, LocalDateTime.now(), true);
    }
}
