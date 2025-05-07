package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.service.OauthPolicyService;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.PresentationFormRequestDto;
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
	private final OauthPolicyService oauthPolicyService;
	private final PresentationSlotRepository slotRepository; // TODO: service로 변경 필요
//	private final PresentationSlotFacadeService slotFacadeService;  // TODO: 구현 후 연결 필요

	/**
	 * 프레젠테이션을 등록합니다.
	 *
	 * @param userInfo  사용자 정보
	 * @param form      프레젠테이션 등록 요청 DTO
	 * @param thumbnail 썸네일 이미지 파일
	 */
	public void registerPresentation(UserInfoDto userInfo,
			PresentationFormRequestDto form,
			MultipartFile thumbnail) throws IOException {

		// check user role
		oauthPolicyService.validatePresentationUser(userInfo);
		User user = userQueryService.getUser(userInfo.getUserId());

		// TODO: slot 검증 및 slotService에서 slotId 가져오는 것으로 변경 (현재의 orElseThrow 제거)
		PresentationSlot slot = slotRepository.findById(form.getSlotId())
				.orElseThrow(() -> new IllegalArgumentException("Invalid slot ID"));

		Presentation newPresentation =
				commandService.createPresentation(user, form, slot, thumbnail);

		// TODO: 검증된 slot에 presentation id 등록
//		slotFacadeService.registerSlot(newPresentation);
	}
}
