package org.ftclub.cabinet.user.service;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.UserRole;

public interface UserService {

	// TODO: 동아리의 경우 Email은 어떻게 할지?
	boolean checkUserExists(String email);

	void createUser(String name, String email, LocalDateTime blackholedAt, UserRole role);

	boolean checkAdminUserExists(String email);

	void createAdminUser(String email);

	void deleteUser(Long userId, LocalDateTime deletedAt);

	void deleteAdminUser(Long adminUserId);

	void updateAdminUserRole(Long adminUserId, AdminRole role);

	/**
	 * 어드민 유저를 email로 찾고, 권한을 승인합니다.
	 *
	 * @param email
	 */
	void promoteAdminByEmail(String email);

	void updateUserBlackholedAt(Long userId, LocalDateTime newBlackholedAt);

	void banUser(Long userId, LentType lentType, LocalDateTime startedAt, LocalDateTime endedAt,
			LocalDateTime expiredAt);

	void deleteRecentBanHistory(Long userId, LocalDateTime today);

	/**
	 * 유저의 정지 상태를 확인합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return 정지 상태인 경우 true, 정지 상태가 아닌 경우 false
	 */
	boolean checkUserIsBanned(Long userId, LocalDateTime today);

	AdminRole getAdminUserRole(String email);

	List<UserBlackholeInfoDto> getAllUserBlackholeInfo();
}
