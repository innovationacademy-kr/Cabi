package org.ftclub.cabinet.auth.domain;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;
import static org.ftclub.cabinet.auth.domain.AuthLevel.MASTER_ONLY;
import static org.ftclub.cabinet.auth.domain.AuthLevel.USER_ONLY;
import static org.ftclub.cabinet.auth.domain.AuthLevel.USER_OR_ADMIN;

import com.fasterxml.jackson.core.JsonProcessingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * {@link AuthGuard} 어노테이션이 붙은 메소드나 클래스에 대해 인증을 검사하는 클래스입니다.
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuthAspect {

	private final TokenValidator tokenValidator;

	private final CookieManager cookieManager;

	private final JwtProperties jwtProperties;

	/**
	 * {@link AuthGuard} 어노테이션이 붙은 곳을 {@link org.aspectj.lang.annotation.Pointcut}으로 인터셉트합니다.
	 * <p>
	 * 해당 포인트 컷이 실행되기 전({@link Before}에 아래 메서드를 실행합니다.
	 *
	 * @param authGuard 인터셉트 된 해당 {@link AuthGuard} - Level을 알아낼 수 있습니다.
	 */
	@Before("@annotation(authGuard))")
	public void AuthToken(AuthGuard authGuard) throws JsonProcessingException {
		/**
		 * 현재 인터셉트 된 서블릿의 {@link HttpServletRequest}를 가져옵니다.
		 */
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getResponse();
		String mainTokenName = jwtProperties.getMainTokenName();
		String adminTokenName = jwtProperties.getAdminTokenName();

		/**
		 * {@link AuthGuard}의 레벨에 따라서 토큰의 유무와 유효성을 검사합니다.
		 * <p>
		 *     ADMIN_ONLY: 관리자 토큰만 유효하면 됩니다.
		 *     USER_ONLY: 유저 토큰만 유효하면 됩니다.
		 *     USER_OR_ADMIN: 유저 토큰 혹은 관리자 토큰이 유효하면 됩니다.
		 * </p>
		 */
		switch (authGuard.level()) {
			case ADMIN_ONLY:
				if (!cookieManager.isCookieExists(request, adminTokenName)
						|| !tokenValidator.isTokenValid(request, ADMIN_ONLY)) {
					cookieManager.deleteCookie(response, adminTokenName);
					throw new ControllerException(ExceptionStatus.UNAUTHORIZED_ADMIN);
				}
				break;
			case USER_ONLY:
				if (!cookieManager.isCookieExists(request, mainTokenName)
						|| !tokenValidator.isTokenValid(request, USER_ONLY)) {
					cookieManager.deleteCookie(response, mainTokenName);
					throw new ControllerException(ExceptionStatus.UNAUTHORIZED_USER);
				}
				break;
			case USER_OR_ADMIN:
				if ((!cookieManager.isCookieExists(request, mainTokenName)
						&& !cookieManager.isCookieExists(request, adminTokenName))
						|| !tokenValidator.isTokenValid(request, USER_OR_ADMIN)) {
					cookieManager.deleteCookie(response, mainTokenName);
					cookieManager.deleteCookie(response, adminTokenName);
					throw new ControllerException(ExceptionStatus.UNAUTHORIZED);
				}
				break;
			case MASTER_ONLY:
				if (!cookieManager.isCookieExists(request, adminTokenName)
						|| !tokenValidator.isTokenValid(request, MASTER_ONLY)) {
					cookieManager.deleteCookie(response, adminTokenName);
					throw new ControllerException(ExceptionStatus.UNAUTHORIZED_ADMIN);
				}
		}
	}
}
