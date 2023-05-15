package org.ftclub.cabinet.user;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.auth.AuthGuard.Level;
import org.ftclub.cabinet.auth.User;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetInfoResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

	private final UserFacadeService userFacadeService;

	@GetMapping("/me")
	@AuthGuard(level = Level.USER_ONLY)
	public MyProfileResponseDto getMyProfile(@User UserSessionDto userSessionDto) {
		MyProfileResponseDto myProfileResponseDto = userFacadeService.getMyProfile(userSessionDto);
		return myProfileResponseDto;
	}

	@GetMapping("/me/lent")
	@AuthGuard(level = Level.USER_ONLY)
	public MyCabinetInfoResponseDto getMyLentAndCabinetInfo(@User UserSessionDto userSessionDto) {
		MyCabinetInfoResponseDto myCabinetInfoResponseDto = userFacadeService.getMyLentAndCabinetInfo(
				userSessionDto.getUserId());
		return myCabinetInfoResponseDto;
	}

	@GetMapping("/me/lent/histories")
	@AuthGuard(level = Level.USER_ONLY)
	public LentHistoryPaginationDto getMyLentHistories(@User UserSessionDto userSessionDto,
			@RequestParam("page") Integer page, @RequestParam("length") Integer length) {
		LentHistoryPaginationDto lentHistoryPaginationDto = userFacadeService.getUserLentHistories(
				userSessionDto.getUserId(), page, length);
		return lentHistoryPaginationDto;
	}

}
