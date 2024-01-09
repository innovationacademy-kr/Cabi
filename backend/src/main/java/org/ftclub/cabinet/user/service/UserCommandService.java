package org.ftclub.cabinet.user.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class UserCommandService {

	private final UserRepository userRepository;

	public User createUserByFtProfile(FtProfile profile) {
		if (userRepository.existsByNameAndEmail(profile.getIntraName(), profile.getEmail())) {
			throw new ServiceException(ExceptionStatus.USER_ALREADY_EXISTED);
		}
		User user = User.of(profile.getIntraName(), profile.getEmail(), profile.getBlackHoledAt(),
				UserRole.USER);
		return userRepository.save(user);
	}

	public User createClubUser(String clubName) {
		if (userRepository.existsByNameAndEmail(clubName, clubName + "@ftclub.org")) {
			throw new ServiceException(ExceptionStatus.EXISTED_CLUB_USER);
		}
		User user = User.of(clubName, clubName + "@ftclub.org", null, UserRole.CLUB);
		return userRepository.save(user);
	}

	public void updateClubName(User user, String clubName) {
		if (!user.isUserRole(UserRole.CLUB)) {
			throw new ServiceException(ExceptionStatus.NOT_CLUB_USER);
		}
		user.changeName(clubName);
		userRepository.save(user);
	}

	public void deleteById(Long userId, LocalDateTime deletedAt) {
		userRepository.deleteById(userId);
	}

	public void deleteClubUser(User clubUser) {
		if (!clubUser.isUserRole(UserRole.CLUB)) {
			throw new ServiceException(ExceptionStatus.NOT_CLUB_USER);
		}
		userRepository.delete(clubUser);
	}

	public void updateAlarmStatus(User user, UpdateAlarmRequestDto updateAlarmRequestDto) {
		user.changeAlarmStatus(updateAlarmRequestDto);
	}

	public void updateUserBlackholedAtById(Long userId, LocalDateTime blackholedAt) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
		user.changeBlackholedAt(blackholedAt);
		userRepository.save(user);
	}
}
