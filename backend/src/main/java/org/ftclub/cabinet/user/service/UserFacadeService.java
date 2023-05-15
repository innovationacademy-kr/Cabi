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

	MyProfileResponseDto getMyProfile(UserSessionDto user);

	/* 기존 searchByBanUser와 동일한 역할을 합니다. */
	BlockedUserPaginationDto getAllBanUsers(Integer page, Integer length);

	/*기존 searchByIntraId 메서드와 동일한 역할을 합니다.*/
	UserProfilePaginationDto getUserProfileListByPartialName(String name, Integer page,
			Integer length);

	UserCabinetPaginationDto findUserCabinetListByPartialName(String name, Integer page,
			Integer length);

	LentHistoryPaginationDto getUserLentHistories(Long userId, Integer page, Integer length);

	MyCabinetInfoResponseDto getMyLentAndCabinetInfo(Long userId);

	boolean checkUserExists(String name);

	void createUser(String name, String email, Date blackholedAt, UserRole role);

	boolean checkAdminUserExists(String email);

	void createAdminUser(String email);

	void deleteUser(Long userId);

	void deleteAdminUser(Long adminUserId);

	void updateAdminUserRole(Long adminUserId, AdminRole role);

	void updateUserBlackholedAtById(Long userId, Date newBlackholedAt);

	void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt, Date expiredAt);

	void unbanUser(Long userId);

	boolean checkUserIsBanned(Long userId);
}
