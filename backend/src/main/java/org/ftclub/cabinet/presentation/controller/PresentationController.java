package org.ftclub.cabinet.presentation.controller;


import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.presentation.service.PresentationService;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v5/presentation")
@RequiredArgsConstructor
public class PresentationController {

    private final PresentationService presentationService;

    @PostMapping("/form")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public void createPresentationForm(
        @UserSession UserSessionDto user,
        @Valid @RequestBody PresentationFormRequestDto dto) {
        presentationService.createPresentationFrom(user.getUserId(), dto);
    }
}
