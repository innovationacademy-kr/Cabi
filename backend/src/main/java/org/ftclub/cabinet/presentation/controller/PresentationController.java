package org.ftclub.cabinet.presentation.controller;


import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.dto.UserDto;
import org.ftclub.cabinet.presentation.service.PresentationFacadeService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/v6/presentations")
@RequiredArgsConstructor
public class PresentationController {

	private final PresentationFacadeService presentationFacadeService;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public void registerPresentation(
			@AuthenticationPrincipal UserDto user,
			@Valid @RequestPart("form") PresentationFormRequestDto form,
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
	) {
		presentationFacadeService.registerPresentation(
				user.getUserId(),
				form,
				thumbnail
		);
	}

}
