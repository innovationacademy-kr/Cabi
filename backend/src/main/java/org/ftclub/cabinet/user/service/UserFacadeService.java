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
	 * @param user
	 * @return MyProfileResponseDto
	 */
	MyProfileResponseDto getMyProfile(UserSessionDto user);

	/**
	 * 모든 정지 유저를 반환합니다.
	 *
	 * @param page
	 * @param length
	 * @param now
	 * @return BlockedUserPaginationDto
	 */
	/* 기존 searchByBanUser와 동일한 역할을 합니다. */
	BlockedUserPaginationDto getAllBanUsers(Integer page, Integer length, Date now);

	/**
	 * 유저 이름의 일부를 입력받아 해당하는 유저들의 프로필을 받아옵니다.
	 *
	 * @param name
	 * @param page
	 * @param length
	 * @return UserProfilePaginationDto
	 */
	/*기존 searchByIntraId 메서드와 동일한 역할을 합니다.*/
	UserProfilePaginationDto getUserProfileListByPartialName(String name, Integer page,
			Integer length);

	/**
	 * 유저 이름의 일부를 입력받아 해당 유저들의 캐비넷 정보를 반환합니다.
	 *
	 * @param name
	 * @param page
	 * @param length
	 * @return UserCabinetPaginationDto
	 */
	UserCabinetPaginationDto findUserCabinetListByPartialName(String name, Integer page,
			Integer length);

	/**
	 * 유저 아이디를 입력받아 해당 유저의 대여 기록을 반환합니다.
	 *
	 * @param userId
	 * @param page
	 * @param length
	 * @return LentHistoryPaginationDto
	 */
	LentHistoryPaginationDto getUserLentHistories(Long userId, Integer page, Integer length);

	/**
	 * 사용자의 아이디를 입력받아 본인의 대여 정보와 캐비넷 정보를 반환합니다.
	 *
	 * @param userId
	 * @return MyCabinetInfoResponseDto
	 */
	MyCabinetInfoResponseDto getMyLentAndCabinetInfo(Long userId);

	/**
	 * 유저가 존재하는지 확인합니다.
	 *
	 * @param name
	 * @return boolean
	 */
	boolean checkUserExists(String name);

	/**
	 * 유저를 생성합니다.
	 *
	 * @param name
	 * @param email
	 * @param blackholedAt
	 * @param role
	 */
	void createUser(String name, String email, Date blackholedAt, UserRole role);

	/**
	 * 관리자가 존재하는지 확인합니다.
	 *
	 * @param email
	 * @return boolean
	 */
	boolean checkAdminUserExists(String email);

	/**
	 * 관리자를 생성합니다.
	 *
	 * @param email
	 */
	void createAdminUser(String email);

	/**
	 * 유저를 삭제합니다.
	 *
	 * @param userId
	 * @param deletedAt
	 */
	void deleteUser(Long userId, Date deletedAt);

	/**
	 * 관리자를 삭제합니다.
	 *
	 * @param adminUserId
	 */
	void deleteAdminUser(Long adminUserId);

	/**
	 * 유저의 권한을 변경합니다.
	 *
	 * @param adminUserId
	 * @param role
	 */
	void updateAdminUserRole(Long adminUserId, AdminRole role);

	/**
	 * 유저의 블랙홀 시간을 변경합니다.
	 *
	 * @param userId
	 * @param newBlackholedAt
	 */
	void updateUserBlackholedAt(Long userId, Date newBlackholedAt);

	/**
	 * 유저를 정지시킵니다.
	 *
	 * @param userId
	 * @param lentType
	 * @param startedAt
	 * @param endedAt
	 * @param expiredAt
	 */
	void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt, Date expiredAt);

	/**
	 * 유저의 정지를 해제합니다.
	 *
	 * @param userId
	 * @param today
	 */
	void unbanUser(Long userId, Date today);
}
