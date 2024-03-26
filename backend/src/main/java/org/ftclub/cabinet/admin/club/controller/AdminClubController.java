package org.ftclub.cabinet.admin.club.controller;


import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.club.service.AdminClubFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.ClubCreateDto;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.dto.ClubUpdateRequestDto;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자가 동아리를 관리할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/clubs")
@Logging
public class AdminClubController {

	private final AdminClubFacadeService adminClubFacadeService;
	private final LentFacadeService lentFacadeService;

	/**
	 * 모든 동아리 정보를 가져옵니다.
	 *
	 * @param pageable 페이징 정보
	 * @return 모든 동아리 정보
	 */
	@GetMapping("")
	@AuthGuard(level = ADMIN_ONLY)
	public ClubInfoPaginationDto getAllClubsInfoDto(@Valid Pageable pageable) {
		return adminClubFacadeService.findAllActiveClubsInfo(pageable);
	}

	/**
	 * 동아리 생성
	 *
	 * @param clubCreateDto 생성할 동아리 정보
	 */
	@PostMapping("")
	@AuthGuard(level = ADMIN_ONLY)
	public void createNewClub(@Valid @RequestBody ClubCreateDto clubCreateDto) {
		adminClubFacadeService.createNewClub(clubCreateDto.getClubName(),
				clubCreateDto.getClubMaster());
	}

	/**
	 * 동아리 삭제
	 *
	 * @param cabinetId 삭제할 동아리 아이디
	 */
	@DeleteMapping("/{cabinetId}")
	@AuthGuard(level = ADMIN_ONLY)
	public void deleteClub(@PathVariable Long cabinetId) {
		adminClubFacadeService.deleteClub(cabinetId);
	}

	/**
	 * 동아리 정보 수정
	 *
	 * @param clubId               동아리 아이디
	 * @param clubUpdateRequestDto 수정할 동아리 정보
	 */
	@PatchMapping("/{clubId}")
	@AuthGuard(level = ADMIN_ONLY)
	public void updateClubUser(@PathVariable("clubId") Long clubId,
			@Valid @RequestBody ClubUpdateRequestDto clubUpdateRequestDto) {
		adminClubFacadeService.updateClub(clubId, clubUpdateRequestDto.getClubName(),
				clubUpdateRequestDto.getClubMaster());
	}

	/**
	 * 동아리의 사물함에 동아리 대여를 설정합니다.
	 *
	 * @param clubId    대여시킬 동아리 ID
	 * @param cabinetId 대여시킬 사물함 ID
	 */
	@PostMapping("/{clubId}/cabinets/{cabinetId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void startClubLent(@PathVariable Long clubId, @PathVariable Long cabinetId) {
		lentFacadeService.startLentClubCabinet(clubId, cabinetId);
	}

	/**
	 * 동아리의 사물함에 대여 중인 동아리를 반납 시킵니다.
	 *
	 * @param clubId    반납할 동아리 ID
	 * @param cabinetId 반납할 사물함 ID
	 */
	@DeleteMapping("/{clubId}/cabinets/{cabinetId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void endClubLent(@PathVariable Long clubId, @PathVariable Long cabinetId,
			@Valid @RequestBody LentEndMemoDto lentEndMemoDto) {
		lentFacadeService.endLentClub(clubId, cabinetId, lentEndMemoDto.getCabinetMemo());
	}
}
