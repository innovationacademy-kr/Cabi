package org.ftclub.cabinet.auth.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.auth.service.UserOauthService;

import java.time.LocalDateTime;

/**
 * 42 OAuth 로그인을 통해 서비스에서 사용하는 프로필 정보를 담는 클래스입니다.
 * <p>
 * 정보에 변경이 생겨야 한다면 {@link UserOauthService}#convertJsonStringToProfile 메서드를 수정하세요.
 */
@Builder
@Getter
@ToString
public class FtProfile {
	private final String intraName;
	private final String email;
	private final LocalDateTime blackHoledAt;
	private final FtRole role;
}
