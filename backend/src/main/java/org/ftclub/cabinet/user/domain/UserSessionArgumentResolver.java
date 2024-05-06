package org.ftclub.cabinet.user.domain;

import io.netty.util.internal.StringUtil;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.service.TokenValidator;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserSessionArgumentResolver implements HandlerMethodArgumentResolver {

	private final TokenValidator tokenValidator;
	private final UserQueryService userQueryService;


	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		boolean hasUserSessionAnnotation = parameter.hasParameterAnnotation(UserSession.class);
		boolean hasUserSessionType =
				UserSessionDto.class.isAssignableFrom(parameter.getParameterType());

		return hasUserSessionAnnotation && hasUserSessionType;
	}

	@Override
	public Object resolveArgument(@NotNull MethodParameter parameter,
			ModelAndViewContainer mavContainer,
			@NotNull NativeWebRequest webRequest,
			WebDataBinderFactory binderFactory) throws Exception {

		HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();

		String authorization = request.getHeader("Authorization");
		if (StringUtil.isNullOrEmpty(authorization) || !authorization.startsWith("Bearer ")) {
			throw ExceptionStatus.INVALID_JWT_TOKEN.asControllerException();
		}
		String token = authorization.substring(7);
		if (StringUtil.isNullOrEmpty(token)) {
			throw ExceptionStatus.INVALID_JWT_TOKEN.asControllerException();
		}
		String name = tokenValidator.getPayloadJson(token).get("name").asText();
		if (StringUtil.isNullOrEmpty(name)) {
			throw ExceptionStatus.INVALID_JWT_TOKEN.asControllerException();
		}
		User user = userQueryService.findUserByName(name)
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);

		return new UserSessionDto(user.getId(), name, user.getEmail(), 1, 1,
				user.getBlackholedAt(), false);
	}
}
