package org.ftclub.cabinet.presentation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PresentationFacadeService {

	private final PresentationCommandService commandService;
	private final PresentationQueryService queryService;
	private final PresentationPolicyService policyService;
	private final UserQueryService userQueryService;
	private final PresentationSlotRepository slotRepository; // TODO: service로 변경 필요

	/**
	 * 프레젠테이션을 등록합니다.
	 *
	 * @param userId    사용자 ID
	 * @param form      프레젠테이션 등록 요청 DTO
	 * @param thumbnail 썸네일 이미지 파일
	 */
	public void registerPresentation(Long userId,
			PresentationFormRequestDto form,
			MultipartFile thumbnail) {

		// TODO: user role 검증
		User user = userQueryService.getUser(userId);

		// TODO: slot 검증 및 slotService에서 slotId 가져오는 것으로 변경 (현재의 orElseThrow 제거)
		PresentationSlot slot = slotRepository.findById(form.getSlotId())
				.orElseThrow(() -> new IllegalArgumentException("Invalid slot ID"));

		commandService.createPresentation(user, form, slot, thumbnail);

	}
}
