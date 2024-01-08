package org.ftclub.cabinet.admin.admin.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.service.AdminFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자가 유저를 관리할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/admins")
@Logging(level = LogLevel.DEBUG)
public class AdminController {

	private final AdminFacadeService adminFacadeService;

	/**
	 * 유저를 관리자로 승격시킵니다.
	 *
	 * @param email 유저의 이메일
	 */
	@AuthGuard(level = AuthLevel.MASTER_ONLY)
	@PostMapping("/{email}/promote")
	public void promoteUserToAdmin(@PathVariable String email) {
		adminFacadeService.promoteAdminByEmail(email);
	}
}
