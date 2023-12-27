package org.ftclub.cabinet.user.oldService;

import io.netty.util.internal.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.occupiedtime.OccupiedTimeManager;
import org.ftclub.cabinet.user.domain.*;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final AdminRepository adminRepository;
	private final BanHistoryRepository banHistoryRepository;
	private final BanPolicy banPolicy;
	private final UserOptionalFetcher userOptionalFetcher;
	private final LentOptionalFetcher lentOptionalFetcher;
	private final LentExtensionRepository lentExtensionRepository;
	private final OccupiedTimeManager occupiedTimeManager;
	private final CabinetProperties cabinetProperties;

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
		Admin admin = userOptionalFetcher.findAdminUserByEmail(email);
		return admin != null;
	}

	/* createUser와 동일한 사유로 로직 수정했습니다. */
	@Override
	public void createAdminUser(String email) {
		log.debug("Called createAdminUser: {}", email);
		Admin admin = Admin.of(email, AdminRole.NONE);
		adminRepository.save(admin);
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
		Admin admin = userOptionalFetcher.getAdminUser(adminUserId);
		adminRepository.delete(admin);
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
	public void updateAdminUserRole(Long adminUserId, AdminRole role) {
		log.debug("Called updateAdminUserRole: {}", adminUserId);
		Admin admin = userOptionalFetcher.getAdminUser(adminUserId);
		admin.changeAdminRole(role);
		adminRepository.save(admin);
	}

	@Override
	public void promoteAdminByEmail(String email) {
		log.debug("Called promoteAdminByEmail: {}", email);
		Admin admin = userOptionalFetcher.getAdminUserByEmail(email);
		if (admin.getRole() == AdminRole.NONE) {
			admin.changeAdminRole(AdminRole.ADMIN);
			adminRepository.save(admin);
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
		List<BanHistory> banHistory = banHistoryRepository.findByUserIdAndUnbannedAt(userId,
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

	public List<UserBlackHoleEvent> getAllRiskOfBlackholeInfo() {
		log.info("Called getAllRiskOfBlackholeInfo");
		List<User> users = userRepository.findByRiskOfFallingIntoBlackholeUsers();
		return users.stream()
				.filter(user -> user.getBlackholedAt().isBefore(LocalDateTime.now().plusDays(7)))
				.map(user -> UserBlackHoleEvent.of(user.getUserId(), user.getName(),
						user.getEmail(), user.getBlackholedAt()))
				.collect(Collectors.toList());
	}

	@Override
	public List<UserBlackHoleEvent> getAllNoRiskOfBlackholeInfo() {
		log.info("Called getAllNoRiskOfBlackholeInfo");
		List<User> users = userRepository.findByNoRiskOfFallingIntoBlackholeUsers();
		return users.stream()
				.filter(user -> user.getBlackholedAt().isBefore(LocalDateTime.now().plusDays(7)))
				.map(user -> UserBlackHoleEvent.of(user.getUserId(), user.getName(),
						user.getEmail(), user.getBlackholedAt()))
				.collect(Collectors.toList());
	}

	@Override
	public User getUserByIdWithAlarmStatus(Long userId) {
		Optional<User> userByIdWithAlarmStatus = userRepository.findUserByIdWithAlarmStatus(userId);
		System.out.println("userByIdWithAlarmStatus = " + userByIdWithAlarmStatus);
		return userRepository.findUserByIdWithAlarmStatus(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}
}
