package org.ftclub.cabinet.user.service;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetInfoResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.UserRole;

public interface UserFacadeService {

	/**
	 * 현재 로그인한 유저의 프로필을 반환합니다. 대여한 사물함 아이디 정보가 포합됩니다.
	 *
	 * @param user 로그인한 유저의 정보
	 * @return {@link MyProfileResponseDto} 현재 로그인한 유저의 정보
	 */
	MyProfileResponseDto getMyProfile(UserSessionDto user);

	/**
	 * 모든 정지 유저를 반환합니다.
	 *
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @param now    현재 시간
	 * @return {@link BlockedUserPaginationDto} 모든 정지 유저
	 */
	/* 기존 searchByBanUser와 동일한 역할을 합니다. */
	BlockedUserPaginationDto getAllBanUsers(Integer page, Integer length, Date now);

	/**
	 * 유저 이름의 일부를 입력받아 해당하는 유저들의 프로필을 받아옵니다.
	 *
	 * @param name   유저 이름의 일부
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @return {@link UserProfilePaginationDto} 해당하는 유저들의 프로필
	 */
	/*기존 searchByIntraId 메서드와 동일한 역할을 합니다.*/
	UserProfilePaginationDto getUserProfileListByPartialName(String name, Integer page,
			Integer length);

	/**
	 * 유저 이름의 일부를 입력받아 해당 유저들의 캐비넷 정보를 반환합니다.
	 *
	 * @param name   유저 이름의 일부
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @return {@link UserCabinetPaginationDto} 해당하는 유저들의 캐비넷 정보
	 */
	UserCabinetPaginationDto findUserCabinetListByPartialName(String name, Integer page,
			Integer length);

	/**
	 * 유저 아이디를 입력받아 해당 유저의 대여 기록을 반환합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param page   페이지 번호
	 * @param length 페이지 당 길이
	 * @return {@link LentHistoryPaginationDto} 해당 유저의 대여 기록
	 */
	LentHistoryPaginationDto getUserLentHistories(Long userId, Integer page, Integer length);

	/**
	 * 사용자의 아이디를 입력받아 본인의 대여 정보와 캐비넷 정보를 반환합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link MyCabinetInfoResponseDto} 본인의 대여 정보와 캐비넷 정보
	 */
	MyCabinetInfoResponseDto getMyLentAndCabinetInfo(Long userId);

	/**
	 * 유저가 존재하는지 확인합니다.
	 *
	 * @param name 유저 이름
	 * @return 유저가 존재하면 true, 아니면 false
	 */
	boolean checkUserExists(String name);

	/**
	 * 유저를 생성합니다.
	 *
	 * @param name         유저 이름
	 * @param email        유저 이메일
	 * @param blackholedAt 유저 블랙홀 날짜
	 * @param role         유저 역할
	 */
	void createUser(String name, String email, Date blackholedAt, UserRole role);

	/**
	 * 관리자가 존재하는지 확인합니다.
	 *
	 * @param email 관리자 이메일
	 * @return 관리자가 존재하면 true, 아니면 false
	 */
	boolean checkAdminUserExists(String email);

	/**
	 * 관리자를 생성합니다.
	 *
	 * @param email 관리자 이메일
	 */
	void createAdminUser(String email);

	/**
	 * 유저를 삭제합니다.
	 *
	 * @param userId    유저 고유 아이디
	 * @param deletedAt 유저 삭제 날짜
	 */
	void deleteUser(Long userId, Date deletedAt);

	/**
	 * 관리자를 삭제합니다.
	 *
	 * @param adminUserId 관리자 고유 아이디
	 */
	void deleteAdminUser(Long adminUserId);

	/**
	 * 유저의 권한을 변경합니다.
	 *
	 * @param adminUserId 관리자 고유 아이디
	 * @param role        관리자 권한
	 */
	void updateAdminUserRole(Long adminUserId, AdminRole role);

	/**
	 * 유저의 블랙홀 시간을 변경합니다.
	 *
	 * @param userId          유저 고유 아이디
	 * @param newBlackholedAt 새로운 유저 블랙홀 시간
	 */
	void updateUserBlackholedAt(Long userId, Date newBlackholedAt);

	/**
	 * 유저를 정지시킵니다.
	 *
	 * @param userId    유저 고유 아이디
	 * @param lentType  현재 대여 타입
	 * @param startedAt 대여 시작 날짜
	 * @param endedAt   대여 종료 날짜
	 * @param expiredAt 대여 만료 날짜
	 */
	void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt, Date expiredAt);

	/**
	 * 유저의 정지를 해제합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param today  현재 날짜
	 */
	void unbanUser(Long userId, Date today);
}
