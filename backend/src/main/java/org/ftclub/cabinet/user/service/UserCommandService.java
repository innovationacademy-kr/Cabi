package org.ftclub.cabinet.user.service;

import java.time.LocalDateTime;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
@Transactional
public class UserCommandService {

	private final UserRepository userRepository;


	public User createUserByFtOauthProfile(FtOauthProfile profile) {
		if (userRepository.existsByNameAndEmail(profile.getIntraName(), profile.getEmail())) {
			throw ExceptionStatus.USER_ALREADY_EXISTED.asServiceException();
		}
		User user = User.of(profile.getIntraName(), profile.getEmail(), profile.getBlackHoledAt(),
				FtRole.combineRolesToString(profile.getRoles()));
		return userRepository.save(user);
	}

	/**
	 * 동아리 유저를 생성합니다.
	 *
	 * @param clubName 동아리 이름
	 * @return 생성된 동아리 유저 객체
	 */
//	public User createClubUser(String clubName) {
//		if (userRepository.existsByNameAndEmail(clubName, clubName + "@ftclub.org")) {
//			throw ExceptionStatus.EXISTED_CLUB_USER.asServiceException();
//		}
////		User user = User.of(clubName, clubName + "@ftclub.org", null, UserRole.CLUB);
//		User user = User.of(clubName, clubName + "@ftclub.org", null);
//		return userRepository.save(user);
//	}

	/**
	 * 동아리 유저의 이름을 변경합니다.
	 *
	 * @param user     동아리 유저 객체
	 * @param clubName 변경할 유저 이름
	 */
	public void updateClubName(User user, String clubName) {
//		if (!user.isUserRole(UserRole.CLUB)) {
//			throw ExceptionStatus.NOT_CLUB_USER.asServiceException();
//		}
		user.changeName(clubName);
		userRepository.save(user);
	}

	/**
	 * 유저를 삭제합니다.
	 *
	 * @param userId    삭제할 유저의 ID
	 * @param deletedAt 삭제 시각
	 */
	public void deleteById(Long userId, LocalDateTime deletedAt) {
		userRepository.deleteById(userId, deletedAt);
	}

	/**
	 * 동아리 유저를 삭제합니다.
	 *
	 * @param clubUser 삭제할 동아리 유저 객체
	 */
	public void deleteClubUser(User clubUser) {
//		if (!clubUser.isUserRole(UserRole.CLUB)) {
//			throw ExceptionStatus.NOT_CLUB_USER.asServiceException();
//		}
		userRepository.deleteById(clubUser.getId(), LocalDateTime.now());
	}

	/**
	 * 유저의 알람 설정을 변경합니다.
	 *
	 * @param user                  유저 객체
	 * @param updateAlarmRequestDto 변경할 알람 설정
	 */
	public void updateAlarmStatus(User user, UpdateAlarmRequestDto updateAlarmRequestDto) {
		user.changeAlarmStatus(updateAlarmRequestDto);
	}

	/**
	 * 유저의 블랙홀과 롤을 변경합니다.
	 *
	 * @param userId       유저의 ID
	 * @param blackholedAt 변경할 blackholedAt
	 */
	public void updateUserBlackholeStatus(Long userId, LocalDateTime blackholedAt) {
		User user = userRepository.getById(userId);
		user.changeBlackholedAt(blackholedAt);
		user.setDeletedAt(null);
		userRepository.save(user);
	}

	/**
	 * 유저 balckholedAt, roles 업데이트에 대한 오버로딩
	 *
	 * @param userId
	 * @param blackholedAt
	 * @param roles
	 */
	public void updateUserBlackholeAndRole(Long userId, LocalDateTime blackholedAt,
			String roles) {
		User user = userRepository.getById(userId);
		updateUserBlackholeAndRole(user, blackholedAt, roles);
	}

	/**
	 * 유저의 blackholedAt, roles 를 업데이트 합니다.
	 *
	 * @param user
	 * @param blackholedAt
	 * @param roles
	 */
	public void updateUserBlackholeAndRole(User user, LocalDateTime blackholedAt,
			String roles) {
		user.changeBlackholedAt(blackholedAt);
		user.setDeletedAt(null);
		user.changeUserRole(roles);
		userRepository.save(user);
	}

	/**
	 * 유저의 role을 변경합니다.
	 *
	 * @param userId
	 * @param roles
	 */
	public void updateUserRoleStatus(Long userId, String roles) {
		User user = userRepository.getById(userId);
		user.changeUserRole(roles);
		userRepository.save(user);
	}

	public void updateCoinAmount(Long userId, Long reward) {
		User user = userRepository.getById(userId);
		user.addCoin(reward);
	}

	public void addBulkCoin(List<Long> userIds, Long amount) {
		userRepository.updateBulkUserCoin(userIds, amount);
	}

	public void updateRole(Long userId, String roles) {
		User user = userRepository.getById(userId);
		user.changeUserRole(roles);
		userRepository.save(user);
	}

	/**
	 * 유저를 삭제하고, role을 업데이트 합니다.
	 *
	 * @param userId
	 * @param roles
	 * @param now
	 */
	public void deleteAndUpdateRole(Long userId, String roles, LocalDateTime now) {
		userRepository.deleteAndUpdateRole(userId, roles, now);
	}

	public void updateUserRoleAndBlackHoledAt(User user, String roles, LocalDateTime blackHoledAt) {
		if (!user.isSameBlackHoledAtAndRole(blackHoledAt, roles)) {
			user.changeUserRole(roles);
			user.changeBlackholedAt(blackHoledAt);
		}
	}
}
