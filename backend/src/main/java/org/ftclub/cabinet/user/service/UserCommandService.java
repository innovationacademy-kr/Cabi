package org.ftclub.cabinet.user.service;

import java.time.LocalDateTime;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
@Transactional
public class UserCommandService {

	private final UserRepository userRepository;

	/**
	 * 유저를 생성합니다.
	 *
	 * @param profile 42서울에서 가져온 유저 프로필
	 * @return 생성된 유저 객체
	 */
	public User createUserByFtProfile(FtProfile profile) {
		if (userRepository.existsByNameAndEmail(profile.getIntraName(), profile.getEmail())) {
			throw ExceptionStatus.USER_ALREADY_EXISTED.asServiceException();
		}
		User user = User.of(profile.getIntraName(), profile.getEmail(), profile.getBlackHoledAt(),
				UserRole.USER);
		return userRepository.save(user);
	}

	/**
	 * 동아리 유저를 생성합니다.
	 *
	 * @param clubName 동아리 이름
	 * @return 생성된 동아리 유저 객체
	 */
	public User createClubUser(String clubName) {
		if (userRepository.existsByNameAndEmail(clubName, clubName + "@ftclub.org")) {
			throw ExceptionStatus.EXISTED_CLUB_USER.asServiceException();
		}
		User user = User.of(clubName, clubName + "@ftclub.org", null, UserRole.CLUB);
		return userRepository.save(user);
	}

	/**
	 * 동아리 유저의 이름을 변경합니다.
	 *
	 * @param user     동아리 유저 객체
	 * @param clubName 변경할 유저 이름
	 */
	public void updateClubName(User user, String clubName) {
		if (!user.isUserRole(UserRole.CLUB)) {
			throw ExceptionStatus.NOT_CLUB_USER.asServiceException();
		}
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
		if (!clubUser.isUserRole(UserRole.CLUB)) {
			throw ExceptionStatus.NOT_CLUB_USER.asServiceException();
		}
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
	 * 유저의 블랙홀을 변경합니다.
	 *
	 * @param userId       유저의 ID
	 * @param blackholedAt 변경할 blackholedAt
	 */
	public void updateUserBlackholedAtById(Long userId, LocalDateTime blackholedAt) {
		User user = userRepository.findById(userId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
		user.changeBlackholedAt(blackholedAt);
		userRepository.save(user);
	}
}
