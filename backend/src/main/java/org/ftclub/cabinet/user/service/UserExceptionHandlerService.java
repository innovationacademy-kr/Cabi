package org.ftclub.cabinet.user.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.AdminUserRepository;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserExceptionHandlerService {

	private final UserRepository userRepository;
	private final AdminUserRepository adminUserRepository;
	private final BanHistoryRepository banHistoryRepository;

	/**
	 * 유저가 존재하는지 확인하고 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param userId 유저의 고유 ID
	 * @return {@link User}
	 */
	public User getUser(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}

	/**
	 * 유저가 존재하는지 확인하고 유저의 고유 ID를 반환합니다. 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param name 찾을 유저의 이름
	 * @return 찾은 유저의 고유 id
	 */
	public User getUserByName(String name) {
		User user = userRepository.getUserByName(name);
		if (user == null) {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_USER);
		}
		return user;
	}

	/**
	 * 동아리가 존재하는지 확인하고 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param userId 동아리의 고유 ID
	 * @return {@link User}
	 */
	public User getClubUser(Long userId) {
		User user = getUser(userId);
		if (!user.isUserRole(UserRole.CLUB)) {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_USER);
		}
		return user;
	}

	/**
	 * 관리자가 존재하는지 확인하고 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param adminUserId 관리자의 고유 ID
	 * @return {@link AdminUser}
	 */
	public AdminUser getAdminUser(Long adminUserId) {
		return adminUserRepository.findById(adminUserId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN_USER));
	}

	/**
	 * 최근 BanHistory를 가져옵니다. 없으면 예외를 발생시킵니다.
	 *
	 * @param userId 유저의 고유 ID
	 * @return {@link BanHistory}
	 */
	public BanHistory getRecentBanHistory(Long userId) {
		return banHistoryRepository.findRecentBanHistoryByUserId(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_BAN_HISTORY));
	}
}
