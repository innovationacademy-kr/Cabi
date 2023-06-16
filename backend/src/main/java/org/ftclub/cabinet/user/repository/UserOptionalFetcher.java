package org.ftclub.cabinet.user.repository;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserOptionalFetcher {

	private final UserRepository userRepository;
	private final AdminUserRepository adminUserRepository;
	private final BanHistoryRepository banHistoryRepository;

	/**
	 * 유저 전체 목록을 가져옵니다.
	 *
	 * @return {@link List} of {@link User}
	 */
	public List<User> findAllUsers() {
		return userRepository.findAll();
	}

	/**
	 * 유저가 존재하는지 확인하고 존재하지 않으면 null을 반환합니다.
	 *
	 * @param userId 유저의 고유 ID
	 * @return {@link User}
	 */
	public User findUser(Long userId) {
		return userRepository.findById(userId).orElse(null);
	}

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
	 * 유저가 존재하는지 확인하고 유저의 고유 ID를 반환합니다. 존재하지 않으면 null을 반환합니다.
	 *
	 * @param name 찾을 유저의 이름
	 * @return 찾은 유저의 고유 id
	 */
	public User findUserByName(String name) {
		return userRepository.findByName(name).orElse(null);
	}

	/**
	 * 유저가 존재하는지 확인하고 유저의 고유 ID를 반환합니다. 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param name 찾을 유저의 이름
	 * @return 찾은 유저의 고유 id
	 */
	public User getUserByName(String name) {
		return userRepository.findByName(name)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
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
	 * 이메일을 통해 어드민 유저가 존재하는지 확인하고 유저를 반환합니다. 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param adminUserEmail 찾을 어드민 유저의 이메일 주소
	 * @return {@link User}
	 */
	public AdminUser getAdminUserByEmail(String adminUserEmail) {
		return adminUserRepository.findByEmail(adminUserEmail)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN_USER));
	}

	/**
	 * 유저의 이름 일부분으로 유저를 검색합니다.
	 *
	 * @param name     유저의 이름 일부분
	 * @param pageable 페이지 정보
	 * @return {@link Page} of {@link User}
	 */
	public Page<User> findUsersByPartialName(String name, Pageable pageable) {
		return userRepository.findByPartialName(name, pageable);
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
