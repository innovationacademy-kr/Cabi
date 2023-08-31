package org.ftclub.cabinet.user.service;

import io.netty.util.internal.StringUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.occupiedtime.UserMonthDataDto;
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
@Log4j2
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final AdminUserRepository adminUserRepository;
	private final BanHistoryRepository banHistoryRepository;
	private final BanPolicy banPolicy;
	private final UserOptionalFetcher userOptionalFetcher;
	private final LentOptionalFetcher lentOptionalFetcher;

	@Override
	public boolean checkUserExists(String email) {
		log.debug("Called checkUserExists: {}", email);
		User user = userOptionalFetcher.findUserByEmail(email);
		return user != null;
	}

	/* createUser는 user를 만드는 행위만 해야될 것 같아 다음과 같이 변경했습니다. */
	@Override
	public void createUser(String name, String email, LocalDateTime blackholedAt, UserRole role) {
		log.debug("Called createUser: {}", email);
		User user = User.of(name, email, blackholedAt, role);
		userRepository.save(user);
	}

	@Override
	public void createClubUser(String clubName) {
		log.debug("Called createClubUser: {}", clubName);
		if (StringUtil.isNullOrEmpty(clubName)) {
			throw new ControllerException(ExceptionStatus.INVALID_ARGUMENT);
		} else if (userOptionalFetcher.findUserByName(clubName) != null &&
				userOptionalFetcher.findUserByName(clubName).getDeletedAt() == null) {
			throw new ControllerException(ExceptionStatus.EXISTED_CLUB_USER);
		} else if (userOptionalFetcher.findUserByName(clubName) != null &&
				userOptionalFetcher.findUserByName(clubName).getDeletedAt() != null) {
			userOptionalFetcher.getUserByName(clubName).setDeletedAt(null);
		} else {
			String randomUUID = UUID.randomUUID().toString();
			User user = User.of(clubName, randomUUID + "@student.42seoul.kr", null, UserRole.CLUB);
			userRepository.save(user);
		}
	}

	@Override
	public boolean checkAdminUserExists(String email) {
		log.debug("Called checkAdminUserExists: {}", email);
		AdminUser adminUser = userOptionalFetcher.findAdminUserByEmail(email);
		return adminUser != null;
	}

	/* createUser와 동일한 사유로 로직 수정했습니다. */
	@Override
	public void createAdminUser(String email) {
		log.debug("Called createAdminUser: {}", email);
		AdminUser adminUser = AdminUser.of(email, AdminRole.NONE);
		adminUserRepository.save(adminUser);
	}

	@Override
	public void deleteUser(Long userId, LocalDateTime deletedAt) {
		log.debug("Called deleteUser: {}", userId);
		User user = userOptionalFetcher.getUser(userId);
		user.setDeletedAt(deletedAt);
		userRepository.save(user);
	}

	@Override
	public void deleteClubUser(Long clubId, LocalDateTime deletedAt) {
		log.debug("Called deleteClueUser: {}", clubId);
		User user = userOptionalFetcher.getClubUser(clubId);
		Cabinet lentCabinet = lentOptionalFetcher.findActiveLentCabinetByUserId(user.getUserId());
		if (lentCabinet != null) {
			throw new ServiceException(ExceptionStatus.CLUB_HAS_LENT_CABINET);
		}
		user.setDeletedAt(deletedAt);
		userRepository.save(user);
	}

	@Override
	public void deleteAdminUser(Long adminUserId) {
		log.debug("Called deleteAdminUser: {}", adminUserId);
		AdminUser adminUser = userOptionalFetcher.getAdminUser(adminUserId);
		adminUserRepository.delete(adminUser);
	}

	@Override
	public void updateUserBlackholedAt(Long userId, LocalDateTime newBlackholedAt) {
		log.debug("Called updateUserBlackholedAt: {}", userId);
		User user = userOptionalFetcher.getUser(userId);
		if (user.getRole() != UserRole.USER) {
			return;
		}
		user.changeBlackholedAt(newBlackholedAt);
		userRepository.save(user);
	}

	@Override
	public void updateUserExtensible(List<UserMonthDataDto> extensibleUsers) {
		log.info("Called updateUserExtensible size = {}", extensibleUsers.size());
		List<String> extensibleUserNames = extensibleUsers.stream().map(UserMonthDataDto::getLogin)
				.collect(Collectors.toList());

		List<User> activeUsers = userRepository.findAllByDeletedAtIsNull();

		activeUsers.forEach(user -> {
			if (extensibleUserNames.contains(user.getName())){
				user.setExtensible(true);
			} else {
				user.setExtensible(false);
			}
		});
	}

	@Override
	public void updateAdminUserRole(Long adminUserId, AdminRole role) {
		log.debug("Called updateAdminUserRole: {}", adminUserId);
		AdminUser adminUser = userOptionalFetcher.getAdminUser(adminUserId);
		adminUser.changeAdminRole(role);
		adminUserRepository.save(adminUser);
	}

	@Override
	public void promoteAdminByEmail(String email) {
		log.debug("Called promoteAdminByEmail: {}", email);
		AdminUser adminUser = userOptionalFetcher.getAdminUserByEmail(email);
		if (adminUser.getRole() == AdminRole.NONE) {
			adminUser.changeAdminRole(AdminRole.ADMIN);
			adminUserRepository.save(adminUser);
		}
	}

	@Override
	public void banUser(Long userId, LentType lentType, LocalDateTime startedAt,
			LocalDateTime endedAt,
			LocalDateTime expiredAt) {
		log.debug("Called banUser: {}", userId);
		BanType banType = banPolicy.verifyForBanType(lentType, startedAt, endedAt, expiredAt);
		if (banType == BanType.NONE) {
			return;
		}
		LocalDateTime banDate = banPolicy.getBanDate(banType, endedAt, expiredAt, userId);
		BanHistory banHistory = BanHistory.of(endedAt, banDate, banType,
				userId);
		banHistoryRepository.save(banHistory);
	}

	@Override
	public void deleteRecentBanHistory(Long userId, LocalDateTime today) {
		log.debug("Called deleteRecentBanHistory: {}", userId);
		BanHistory banHistory = userOptionalFetcher.getRecentBanHistory(userId);
		if (banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), today)) {
			banHistoryRepository.delete(banHistory);
		}
	}

	@Override
	public boolean checkUserIsBanned(Long userId, LocalDateTime today) {
		log.debug("Called checkUserIsBanned: {}", userId);
		List<BanHistory> banHistory = banHistoryRepository.findUserActiveBanList(userId,
				today);
		return (banHistory.size() != 0);
	}

	@Override
	public AdminRole getAdminUserRole(String email) {
		log.debug("Called getAdminUserRole: {}", email);
		return userOptionalFetcher.findAdminUserRoleByEmail(email);
	}

	@Override
	public void updateClubUser(Long clubId, String clubName) {
		log.debug("Called updateClubUser: {}", clubId);
		if (StringUtil.isNullOrEmpty(clubName)) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		User clubUser = userOptionalFetcher.getClubUser(clubId);
		clubUser.changeName(clubName);
	}
	
	public List<UserBlackholeInfoDto> getAllRiskOfBlackholeInfo() {
		log.info("Called getAllRiskOfBlackholeInfo");
		List<User> users = userRepository.findByRiskOfFallingIntoBlackholeUsers();
		return users.stream()
				.filter(user -> user.getBlackholedAt().isBefore(LocalDateTime.now().plusDays(7)))
				.map(user -> UserBlackholeInfoDto.of(user.getUserId(), user.getName(),
						user.getEmail(), user.getBlackholedAt()))
				.collect(Collectors.toList());
	}

	@Override
	public List<UserBlackholeInfoDto> getAllNoRiskOfBlackholeInfo() {
		log.info("Called getAllNoRiskOfBlackholeInfo");
		List<User> users = userRepository.findByNoRiskOfFallingIntoBlackholeUsers();
		return users.stream()
				.filter(user -> user.getBlackholedAt().isBefore(LocalDateTime.now().plusDays(7)))
				.map(user -> UserBlackholeInfoDto.of(user.getUserId(), user.getName(),
						user.getEmail(), user.getBlackholedAt()))
				.collect(Collectors.toList());
	}
}
