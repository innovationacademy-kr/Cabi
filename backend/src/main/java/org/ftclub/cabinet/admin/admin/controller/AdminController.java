package org.ftclub.cabinet.admin.admin.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.admin.admin.service.AdminFacadeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자가 유저를 관리할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/admins")
@Log4j2
public class AdminController {

	private final AdminFacadeService adminFacadeService;

	public void promoteUserToAdmin(@RequestParam("email") String email) {
	}
}
