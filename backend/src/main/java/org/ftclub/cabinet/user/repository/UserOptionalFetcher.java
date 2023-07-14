package org.ftclub.cabinet.user.repository;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserOptionalFetcher {

	private final UserRepository userRepository;
	private final AdminUserRepository adminUserRepository;
	private final BanHistoryRepository banHistoryRepository;

	/*-------------------------------------------FIND-------------------------------------------*/

	/**
	 * 유저 전체 목록을 가져옵니다.
	 *
	 * @return {@link List} of {@link User}
	 */
	public List<User> findAllUsers() {
		log.info("Called findAllUsers");
		return userRepository.findAll();
	}

	/**
	 * 유저가 존재하는지 확인하고 존재하지 않으면 null을 반환합니다.
	 *
	 * @param userId 유저의 고유 ID
	 * @return {@link User}
	 */
	public User findUser(Long userId) {
		log.info("Called findUser: {}", userId);
		return userRepository.findById(userId).orElse(null);
	}

	/**
	 * 유저가 존재하는지 확인하고 유저의 고유 ID를 반환합니다. 존재하지 않으면 null을 반환합니다.
	 *
	 * @param name 찾을 유저의 이름
	 * @return 찾은 유저의 고유 id
	 */
	public User findUserByName(String name) {
		log.info("Called findUserByName: {}", name);
		return userRepository.findByName(name).orElse(null);
	}

	/**
	 * 유저의 이메일로 유저를 검색합니다.
	 *
	 * @param email 유저의 이메일
	 */
	public User findUserByEmail(String email) {
		log.info("Called findUserByEmail: {}", email);
		return userRepository.findByEmail(email).orElse(null);
	}

	/**
	 * 유저의 이름 일부분으로 유저를 검색합니다.
	 *
	 * @param name     유저의 이름 일부분
	 * @param pageable 페이지 정보
	 * @return {@link Page} of {@link User}
	 */
	public Page<User> findUsersByPartialName(String name, Pageable pageable) {
		log.info("Called findUsersByPartialName: {}", name);
		return userRepository.findByPartialName(name, pageable);
	}

	/**
	 * 어드민 유저 아이디로 어드민 유저를 찾습니다.
	 *
	 * @param adminUserId 어드민 유저 아이디
	 * @return {@link AdminUser}
	 */
	public AdminUser findAdminUser(Long adminUserId) {
		log.info("Called findAdminUser: {}", adminUserId);
		return adminUserRepository.findAdminUser(adminUserId).orElse(null);
	}

	/**
	 * 어드민 유저의 이메일로 어드민 유저를 찾습니다.
	 *
	 * @param email 어드민 유저의 이메일
	 * @return {@link AdminUser}
	 */
	public AdminUser findAdminUserByEmail(String email) {
		log.info("Called findAdminUserByEmail: {}", email);
		return adminUserRepository.findAdminUserByEmail(email).orElse(null);
	}

	/**
	 *
	 */
	public AdminRole findAdminUserRoleByEmail(String email) {
		log.info("Called findAdminUserRoleByEmail: {}", email);
		return adminUserRepository.findAdminUserRoleByEmail(email)
				.orElse(null);
	}

	/**
	 * 유저의 BanHistory 목록을 가져옵니다.
	 *
	 * @param pageable 페이지 정보
	 * @param now      현재 시간
	 * @return {@link Page} of {@link BanHistory}
	 */
	public Page<BanHistory> findPaginationActiveBanHistories(Pageable pageable, LocalDateTime now) {
		log.info("Called findPaginationActiveBanHistories");
		return banHistoryRepository.findPaginationActiveBanHistories(pageable, now);
	}

	/**
	 * 유저의 가장 최근 BanHistory를 가져옵니다. 없으면 null을 반환합니다.
	 *
	 * @param userId 유저의 고유 ID
	 * @param now    현재 시간
	 * @return {@link BanHistory}
	 */
	//TO-DO : isEmpty, List에 대한 0 인덱스 가져오기 등 리팩터링 매우 필요..
	public BanHistory findRecentActiveBanHistory(Long userId, LocalDateTime now) {
		log.info("Called findRecentActiveBanHistory: {}", userId);
		List<BanHistory> banHistories = banHistoryRepository.findRecentBanHistoryByUserId(userId,
				now,
				PageRequest.of(0, 1));
		if (banHistories.isEmpty()) {
			return null;
		}
		return banHistories.get(0);
	}

	/**
	 * ROLE 이 동아리(CLUB)인 유저를 가져옵니다
	 *
	 * @param pageable
	 * @return {@link Page<User>}
	 */
	public Page<User> findClubUsers(Pageable pageable) {
		log.info("Called findClubUsers");
		return userRepository.findAllByRoleAndDeletedAtIsNull(UserRole.CLUB, pageable);
	}

	/*-------------------------------------------GET--------------------------------------------*/

	/**
	 * 유저가 존재하는지 확인하고 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param userId 유저의 고유 ID
	 * @return {@link User}
	 */
	public User getUser(Long userId) {
		log.info("Called getUser: {}", userId);
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
		log.info("Called getUserByName: {}", name);
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
		log.info("Called getClubUser: {}", userId);
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
		log.info("Called getAdminUser: {}", adminUserId);
		return adminUserRepository.findAdminUser(adminUserId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN_USER));
	}

	/**
	 * 이메일을 통해 어드민 유저가 존재하는지 확인하고 유저를 반환합니다. 존재하지 않으면 예외를 발생시킵니다.
	 *
	 * @param adminUserEmail 찾을 어드민 유저의 이메일 주소
	 * @return {@link User}
	 */
	public AdminUser getAdminUserByEmail(String adminUserEmail) {
		log.info("Called getAdminUserByEmail: {}", adminUserEmail);
		return adminUserRepository.findAdminUserByEmail(adminUserEmail)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN_USER));
	}

	/**
	 * 최근 BanHistory를 가져옵니다. 없으면 예외를 발생시킵니다.
	 *
	 * @param userId 유저의 고유 ID
	 * @return {@link BanHistory}
	 */
	//to-do : if null exception
	public BanHistory getRecentBanHistory(Long userId) {
		log.info("Called getRecentBanHistory: {}", userId);
		List<BanHistory> banHistory = banHistoryRepository.findRecentBanHistoryByUserId(userId,
				LocalDateTime.now(),
				PageRequest.of(0, 1));
		if (banHistory.isEmpty()) {
			throw new DomainException(ExceptionStatus.NOT_FOUND_BAN_HISTORY);
		}
		return banHistory.get(0);
	}
}
