package org.ftclub.cabinet.presentation.service;

import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateServiceDto;
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
	 * @param userId       사용자 ID (ANONYMOUS=null)
	 * @param presentation 프레젠테이션
	 */
	public void verifyPresentationDetailAccess(Long userId,
			Presentation presentation) {
		// ANONYMOUS: can access only public allowed and not cancelled
		if (userId == null) {
			if (!presentation.isPublicAllowed() || presentation.isCanceled()) {
				throw ExceptionStatus.NOT_LOGGED_IN.asServiceException();
			}
			return;
		}

		// USER: allow all presentations except cancelled (only creator can access cancelled)
		if (presentation.isCanceled()) {
			if (!userId.equals(presentation.getUser().getId())) {
				throw ExceptionStatus.CANCELED_PRESENTATION.asServiceException();
			}
		}
	}

	/**
	 * 프레젠테이션이 수정 가능한 상태인지 검증합니다.
	 * <p>
	 * 취소된 발표는 원칙적으로 수정이 불가능합니다.
	 * </p>
	 *
	 * @param presentation 프레젠테이션
	 */
	private void checkPresentationEditable(Presentation presentation) {
		if (presentation.isCanceled()) {
			throw ExceptionStatus.CANCELED_PRESENTATION_EDIT_DENIED.asServiceException();
		}
	}

	/**
	 * 유저의 프레젠테이션의 수정 권한을 검증합니다.
	 * <p>
	 * 작성자만 수정할 수 있으며, 취소된 발표는 수정이 불가능합니다.
	 * </p>
	 *
	 * @param userId       사용자 ID
	 * @param presentation 프레젠테이션
	 */
	public void verifyPresentationEditAccess(Long userId, Presentation presentation) {
		if (!userId.equals(presentation.getUser().getId())) {
			throw ExceptionStatus.NOT_PRESENTATION_CREATOR.asServiceException();
		}
		checkPresentationEditable(presentation);
	}

	/**
	 * 어드민의 프레젠테이션 수정 권한을 검증합니다.
	 * <p>
	 * 취소된 발표는 수정이 불가능합니다.
	 * </p>
	 *
	 * @param presentation 프레젠테이션
	 */
	public void verifyAdminPresentationEditAccess(Presentation presentation) {
		checkPresentationEditable(presentation);
	}

	/**
	 * 유저가 수정 불가능한 필드를 수정했는지 검증합니다.
	 * <p>
	 * 수정 불가능한 필드: duration, category, title, videoLink, recordingAllowed
	 * </p>
	 *
	 * @param updateForm 프레젠테이션 수정 DTO
	 * @param origin     프레젠테이션
	 */
	public void checkForIllegalFieldModification(
			PresentationUpdateServiceDto updateForm, Presentation origin) {
		// if not allowed fields updated, throw exception
		if (updateForm.getDuration() != origin.getDuration()) {
			throw ExceptionStatus.PRESENTATION_UPDATE_DURATION_DENIED.asServiceException();
		}
		if (updateForm.getCategory() != origin.getCategory()) {
			throw ExceptionStatus.PRESENTATION_UPDATE_CATEGORY_DENIED.asServiceException();
		}
		if (!Objects.equals(updateForm.getTitle(), origin.getTitle())) {
			throw ExceptionStatus.PRESENTATION_UPDATE_TITLE_DENIED.asServiceException();
		}
		if (!Objects.equals(updateForm.getVideoLink(), origin.getVideoLink())) {
			throw ExceptionStatus.PRESENTATION_UPDATE_VIDEO_LINK_DENIED.asServiceException();
		}
		if (updateForm.isRecordingAllowed() != origin.isRecordingAllowed()) {
			throw ExceptionStatus.PRESENTATION_UPDATE_RECORDING_ALLOWED_DENIED.asServiceException();
		}
	}
}
