package org.ftclub.cabinet.presentation.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationPolicyService {

	/**
	 * 유저의 프레젠테이션 상세정보 조회에 대한 권한을 검증합니다.
	 * <p>
	 * publicAllowed가 true인 경우, 모든 사용자가 조회할 수 있습니다.
	 * </p>
	 * <p>
	 * canceled가 true인 경우, 작성자만 조회할 수 있습니다.
	 * </p>
	 *
	 * @param userInfoDto  사용자 정보
	 * @param presentation 프레젠테이션
	 */
	public void verifyPresentationDetailAccess(UserInfoDto userInfoDto,
			Presentation presentation) {
		// ANONYMOUS: only public allowed and not cancelled
		if (userInfoDto == null) {
			if (!presentation.isPublicAllowed() || presentation.isCanceled()) {
				throw ExceptionStatus.NOT_LOGGED_IN.asServiceException();
			}
			return;
		}

		// USER: allowed except cancelled
		if (presentation.isCanceled()) {
			if (userInfoDto.getUserId() != presentation.getUser().getId()) {
				throw ExceptionStatus.CANCELLED_PRESENTATION.asServiceException();
			}
		}
	}
}
