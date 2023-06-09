package org.ftclub.cabinet.auth.domain;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 인증이 필요한 부분에 붙이는 AOP 어노테이션입니다.
 * <br>
 * 컨트롤러 메서드에만 사용할 수 있습니다.
 * <br>
 * {@link AuthAspect}에서 이 어노테이션을 검사합니다.
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthGuard {

	AuthLevel level() default AuthLevel.USER_ONLY;

	/**
	 * 해당 어노테이션의 Level을 이용해서, 필요한 인증의 유무를 명시합니다. USER : 일반 유저 ADMIN : 일반 관리자 MASTER : 최고 관리자
	 */

}
