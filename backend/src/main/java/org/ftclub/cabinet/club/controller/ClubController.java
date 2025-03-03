package org.ftclub.cabinet.club.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.service.ClubFacadeService;
import org.ftclub.cabinet.dto.AddClubUserRequestDto;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.dto.ClubInfoResponseDto;
import org.ftclub.cabinet.dto.ClubMemoUpdateDto;
import org.ftclub.cabinet.dto.ClubNoticeUpdateDto;
import org.ftclub.cabinet.dto.MandateClubMasterRequestDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/clubs")
@Logging
public class ClubController {

	private final ClubFacadeService clubFacadeService;

	/**
	 * 내가 속한 동아리 목록을 조회한다.
	 *
	 * @param user 사용자 세션
	 * @return 내가 속한 동아리 목록
	 */
	@GetMapping("")
	public ClubInfoPaginationDto getMyClubs(@AuthenticationPrincipal UserInfoDto user) {
		return clubFacadeService.getMyClubs(user.getUserId());
	}

	/**
	 * 동아리 정보를 조회한다.
	 *
	 * @param user     사용자 세션
	 * @param clubId   동아리 ID
	 * @param pageable 페이징 정보
	 * @return 동아리 정보
	 */
	@GetMapping("/{clubId}")
	public ClubInfoResponseDto getClubInfo(@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long clubId,
			@Valid Pageable pageable) {
		return clubFacadeService.getClubInfo(user.getUserId(), clubId, pageable);
	}

	/**
	 * 동아리에 사용자를 추가한다.
	 *
	 * @param user                  사용자 세션
	 * @param clubId                동아리 ID
	 * @param addClubUserRequestDto 사용자 추가 요청 정보
	 */
	@PostMapping("/{clubId}/users")
	public void addClubUser(@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long clubId,
			@Valid @RequestBody AddClubUserRequestDto addClubUserRequestDto) {
		clubFacadeService.addClubUser(user.getUserId(), clubId, addClubUserRequestDto.getName());
	}

	/**
	 * 동아리에서 사용자를 제거한다.
	 *
	 * @param user   사용자 세션
	 * @param clubId 동아리 ID
	 * @param userId 사용자 ID
	 */
	@DeleteMapping("/{clubId}/users/{userId}")
	public void deleteClubUser(@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long clubId,
			@PathVariable Long userId) {
		clubFacadeService.deleteClubUser(user.getUserId(), clubId, userId);
	}

	/**
	 * 동아리장을 위임한다.
	 *
	 * @param user                        사용자 세션
	 * @param clubId                      동아리 ID
	 * @param mandateClubMasterRequestDto 동아리장 위임 요청 정보
	 */
	@PostMapping("/{clubId}/mandate")
	public void mandateClubUser(@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long clubId,
			@Valid @RequestBody MandateClubMasterRequestDto mandateClubMasterRequestDto) {
		clubFacadeService.mandateClubUser(user.getUserId(), clubId,
				mandateClubMasterRequestDto.getClubMaster());
	}

	@PostMapping("/{clubId}/notice")
	public void updateClubNotice(@AuthenticationPrincipal UserInfoDto user,
			@PathVariable Long clubId,
			@Valid @RequestBody ClubNoticeUpdateDto clubNoticeUpdateDto) {
		clubFacadeService.updateClubNotice(user.getUserId(), clubId,
				clubNoticeUpdateDto.getNotice());
	}

	@PostMapping("/{clubId}/memo")
	public void updateClubMemo(@AuthenticationPrincipal UserInfoDto user, @PathVariable Long clubId,
			@Valid @RequestBody ClubMemoUpdateDto clubMemoUpdateDto) {
		clubFacadeService.updateClubMemo(user.getUserId(), clubId, clubMemoUpdateDto.getMemo());
	}
}
