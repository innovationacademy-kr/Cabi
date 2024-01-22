package org.ftclub.cabinet.admin.club.controller;


import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.club.service.AdminClubFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자가 클럽을 관리할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/clubs")
@Logging
public class AdminClubController {

	private final AdminClubFacadeService adminClubFacadeService;

	/**
	 * 전체 동아리 조회
	 *
	 * @return 동아리의 PK와 이름 정보만을 반환합니다.
	 */
	@GetMapping("/all")
	@AuthGuard(level = ADMIN_ONLY)
	public ClubInfoPaginationDto getAllClubsInfoDto(@Valid Pageable pageable
	) {
		return adminClubFacadeService.findAllClubsInfo(pageable);
	}

	/**
	 *동아리 추가
	 *
	 * @Param 동아
	 * @return 동아리의 PK와 이름 정보만을 반환합니다.
	 */

	/**
	 *동아리 추가
	 *
	 *
	 * @return 동아리의 PK와 이름 정보만을 반환합니다.
	 */
}
