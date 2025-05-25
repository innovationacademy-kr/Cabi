package org.ftclub.cabinet.presentation.controller;


import java.io.IOException;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.presentation.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.presentation.service.PresentationFacadeService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@Slf4j
@RestController
@RequestMapping("/v6/presentations")
@RequiredArgsConstructor
public class PresentationController {

	private final PresentationFacadeService presentationFacadeService;

	/**
	 * 프레젠테이션을 등록합니다.
	 *
	 * @param user
	 * @param form
	 * @param thumbnail
	 * @throws IOException
	 */
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public void registerPresentation(
			@AuthenticationPrincipal UserInfoDto user,
			@Valid @RequestPart("form") PresentationFormRequestDto form,
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
	) throws IOException {
		presentationFacadeService.registerPresentation(
				user.getUserId(),
				form,
				thumbnail
		);
	}

}
