package org.ftclub.cabinet.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.LentExtensionPaginationDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.UserSession;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 유저가 자신의 정보를 확인할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/users")
@Log4j2
public class UserController {

    private final UserFacadeService userFacadeService;

    /**
     * 현재 로그인한 유저의 프로필을 반환합니다. 전체 사물함 뷰에서 본인의 사물함을 표시하기 위해 사용됩니다.
     *
     * @param userSessionDto 현재 로그인한 유저의 세션 정보
     * @return {@link MyProfileResponseDto} 현재 로그인한 유저의 프로필
     */
    @GetMapping("/me")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public MyProfileResponseDto getMyProfile(@UserSession UserSessionDto userSessionDto) {
        log.info("Called getMyProfile: {}", userSessionDto.getName());
        return userFacadeService.getMyProfile(userSessionDto);
    }

    @GetMapping("/me/lent-extensions")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public LentExtensionPaginationDto getMyLentExtension(
            @UserSession UserSessionDto userSessionDto) {
        log.info("Called getMyLentExtension: {}", userSessionDto.getName());
        return userFacadeService.getMyLentExtension(userSessionDto);
    }

    @GetMapping("/me/lent-extensions/active")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public LentExtensionPaginationDto getMyActiveLentExtension(
            @UserSession UserSessionDto userSessionDto) {
        log.info("Called getMyActiveLentExtension: {}", userSessionDto.getName());
        return userFacadeService.getMyActiveLentExtension(userSessionDto);
    }

    @GetMapping("/me/lent-extensions/use")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public void useLentExtension(
            @UserSession UserSessionDto userSessionDto) {
        log.info("Called useLentExtension");
        userFacadeService.useLentExtension(userSessionDto);
    }
}
