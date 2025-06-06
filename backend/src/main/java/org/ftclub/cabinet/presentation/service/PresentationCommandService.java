package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateData;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class PresentationCommandService {

	private final PresentationQueryService queryService;
	private final PresentationRepository repository;
	private final ThumbnailStorageService thumbnailStorageService;

	/**
	 * 프레젠테이션을 생성합니다.
	 *
	 * @param user           사용자
	 * @param form           프레젠테이션 등록 DTO
	 * @param slot           슬롯
	 * @param thumbnailS3Key 썸네일 이미지 S3 키
	 * @return 생성된 프레젠테이션
	 */
	public Presentation createPresentation(User user,
			PresentationFormRequestDto form,
			PresentationSlot slot,
			String thumbnailS3Key) {
		// create
		Presentation newPresentation = Presentation.of(
				user,
				form.getCategory(),
				form.getDuration(),
				form.getTitle(),
				form.getSummary(),
				form.getOutline(),
				form.getDetail(),
				thumbnailS3Key,
				form.isRecordingAllowed(),
				form.isPublicAllowed(),
				slot
		);
		// save
		return repository.save(newPresentation);
	}

	/**
	 * 프레젠테이션을 수정합니다.
	 * <p>
	 * PresentationUpdateData 내부의 toUpdate 필드에 따라 domain 함수에서 수정을 진행합니다.
	 * </p>
	 *
	 * @param presentation 프레젠테이션
	 * @param data         수정 데이터
	 */
	public void updatePresentation(Presentation presentation, PresentationUpdateData data) {
		presentation.update(data);
	}

	/**
	 * 프레젠테이션의 썸네일을 수정합니다.
	 * <p>
	 * 변경된 이미지를 업로드하고 S3 키를 업데이트합니다.
	 * </p>
	 *
	 * @param presentation 프레젠테이션
	 * @param thumbnail    썸네일 이미지 파일
	 */
	public void updateThumbnail(Presentation presentation, MultipartFile thumbnail)
			throws IOException {
		String oldThumbnailS3Key = presentation.getThumbnailS3Key();
		if (oldThumbnailS3Key != null) {
			thumbnailStorageService.deleteImage(oldThumbnailS3Key);
		}
		// upload new thumbnail and update key
		String newThumbnailS3Key = thumbnailStorageService.uploadImage(thumbnail);
		presentation.changeThumbnailS3Key(newThumbnailS3Key);
	}

	/**
	 * 프레젠테이션 슬롯과 연결된 내용을 수정합니다.
	 * <p>
	 * 변경된 슬롯의 시작 시간과 발표 장소를 프레젠테이션에 반영합니다.
	 * </p>
	 *
	 * @param presentationId       프레젠테이션 ID
	 * @param startTime            시작 시간
	 * @param presentationLocation 발표 장소
	 */
	public void updateSlotDetails(Long presentationId,
			LocalDateTime startTime, PresentationLocation presentationLocation) {
		Presentation presentation = queryService.findPresentationById(presentationId);
		presentation.changeSlotContents(startTime, presentationLocation);
	}

	/**
	 * 프레젠테이션을 취소합니다. 슬롯에서도 해당 발표를 취소합니다.
	 * <p>
	 * 보칼의 일정과 관련되어 있어 어드민에서 관리합니다.
	 * </p>
	 *
	 * @param presentationId 프레젠테이션 ID
	 */
	public void cancelPresentation(Long presentationId) {
		Presentation presentation = queryService.findPresentationByIdWithSlot(presentationId);
		if (presentation.isCanceled()) {
			throw ExceptionStatus.PRESENTATION_ALREADY_CANCELED.asServiceException();
		}
		PresentationSlot slot = presentation.getSlot();
		slot.cancelPresentation();
		presentation.cancel();
	}

}
