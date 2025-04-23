package org.ftclub.cabinet.presentation.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationPolicyService {

	public void validatePresentator(UserInfoDto userInfo) {
		// TODO: user role check -> move to userPolicyService ?
		if (!userInfo.hasRole("USER")) {
			throw ExceptionStatus.PRESENTATION_ACCESS_DENIED.asServiceException();
		}
	}

}
