package org.ftclub.cabinet.auth.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;

/**
 * 수요지식회에서의 인증 정책을 관리하는 서비스
 */
@Service
@RequiredArgsConstructor
public class OauthPolicyService {

	/**
	 * 발표 신청 권한이 있는지 확인합니다. 로그인 유저만 신청 가능합니다.
	 */
	public void validatePresentationUser(UserInfoDto userInfo) {
		if (!userInfo.hasRole("USER")) {
			throw ExceptionStatus.NOT_LOGGED_IN.asServiceException();
		}
	}

}
