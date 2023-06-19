package org.ftclub.cabinet.user.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanPolicy;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.AdminUserRepository;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
	private static final Logger logger = LogManager.getLogger(UserService.class);
	private final UserRepository userRepository;
	private final AdminUserRepository adminUserRepository;
	private final BanHistoryRepository banHistoryRepository;
	private final BanPolicy banPolicy;
	private final UserOptionalFetcher userOptionalFetcher;

	@Override
	public boolean checkUserExists(String email) {
		logger.info("Called checkUserExists: {}", email);
		User user = userOptionalFetcher.findUserByEmail(email);
		return user != null;
	}

	/* createUser는 user를 만드는 행위만 해야될 것 같아 다음과 같이 변경했습니다. */
	@Override
	public void createUser(String name, String email, Date blackholedAt, UserRole role) {
		logger.info("Called createUser: {}", email);
		User user = User.of(name, email, blackholedAt, role);
		userRepository.save(user);
	}

	@Override
	public boolean checkAdminUserExists(String email) {
		logger.info("Called checkAdminUserExists: {}", email);
		AdminUser adminUser = userOptionalFetcher.findAdminUserByEmail(email);
		return adminUser != null;
	}

	/* createUser와 동일한 사유로 로직 수정했습니다. */
	@Override
	public void createAdminUser(String email) {
		logger.info("Called createAdminUser: {}", email);
		AdminUser adminUser = AdminUser.of(email, AdminRole.NONE);
		adminUserRepository.save(adminUser);
	}

	@Override
	public void deleteUser(Long userId, Date deletedAt) {
		logger.info("Called deleteUser: {}", userId);
		User user = userOptionalFetcher.getUser(userId);
		user.setDeletedAt(deletedAt);
		userRepository.save(user);
	}

	@Override
	public void deleteAdminUser(Long adminUserId) {
		logger.info("Called deleteAdminUser: {}", adminUserId);
		AdminUser adminUser = userOptionalFetcher.getAdminUser(adminUserId);
		adminUserRepository.delete(adminUser);
	}

	@Override
	public void updateUserBlackholedAt(Long userId, Date newBlackholedAt) {
		logger.info("Called updateUserBlackholedAt: {}", userId);
		User user = userOptionalFetcher.getUser(userId);
		if (user.getRole() != UserRole.USER) {
			return;
		}
		user.changeBlackholedAt(newBlackholedAt);
		userRepository.save(user);
	}

	@Override
	public void updateAdminUserRole(Long adminUserId, AdminRole role) {
		logger.info("Called updateAdminUserRole: {}", adminUserId);
		AdminUser adminUser = userOptionalFetcher.getAdminUser(adminUserId);
		adminUser.changeAdminRole(role);
		adminUserRepository.save(adminUser);
	}

	@Override
	public void promoteAdminByEmail(String email) {
		logger.info("Called promoteAdminByEmail: {}", email);
		AdminUser adminUser = userOptionalFetcher.getAdminUserByEmail(email);
		if (adminUser.getRole() == AdminRole.NONE) {
			adminUser.changeAdminRole(AdminRole.ADMIN);
		}
	}

	@Override
	public void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt,
			Date expiredAt) {
		logger.info("Called banUser: {}", userId);
		BanType banType = banPolicy.verifyForBanType(lentType, startedAt, endedAt, expiredAt);
		if (banType == BanType.NONE) {
			return;
		}
		Date banDate = banPolicy.getBanDate(banType, endedAt, expiredAt, userId);
		BanHistory banHistory = BanHistory.of(endedAt, banDate, banType, userId);
		banHistoryRepository.save(banHistory);
	}

	@Override
	public void deleteRecentBanHistory(Long userId, Date today) {
		logger.info("Called deleteRecentBanHistory: {}", userId);
		BanHistory banHistory = userOptionalFetcher.getRecentBanHistory(userId);
		if (banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), today)) {
			banHistoryRepository.delete(banHistory);
		}
	}

	@Override
	public boolean checkUserIsBanned(Long userId, Date today) {
		logger.info("Called checkUserIsBanned: {}", userId);
		List<BanHistory> banHistory = banHistoryRepository.findUserActiveBanList(userId,
				today);
		return (banHistory.size() != 0);
	}

	@Override
	public AdminRole getAdminUserRole(String email) {
		logger.info("Called getAdminUserRole: {}", email);
		return userOptionalFetcher.findAdminUserRoleByEmail(email);
	}
}
