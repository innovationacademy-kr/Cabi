package org.ftclub.cabinet.user.service;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.UserRole;

public interface UserService {

	// TODO: 동아리의 경우 Email은 어떻게 할지?
	boolean checkUserExists(String name);

	void createUser(String name, String email, Date blackholedAt, UserRole role);

	boolean checkAdminUserExists(String email);

	void createAdminUser(String email);

	void deleteUser(Long userId, Date deletedAt);

	void deleteAdminUser(Long adminUserId);

	void updateAdminUserRole(Long adminUserId, AdminRole role);

	void updateUserBlackholedAt(Long userId, Date newBlackholedAt);

	void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt, Date expiredAt);

	void deleteRecentBanHistory(Long userId, Date today);

	/**
	 * 유저의 정지 상태를 확인합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return 정지 상태인 경우 true, 정지 상태가 아닌 경우 false
	 */
	boolean checkUserIsBanned(Long userId, Date today);

	Integer getAdminUserRole(String email);
}
