package org.ftclub.cabinet.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserCommandService {

	private final UserRepository userRepository;

	public User createUserByFtProfile(FtProfile profile) {
		log.info("Called createUserByFtProfile. {}", profile);
		if (userRepository.existsByNameAndEmail(profile.getIntraName(), profile.getEmail())) {
			log.warn("이미 존재하는 유저입니다. {}", profile);
			throw new ServiceException(ExceptionStatus.USER_ALREADY_EXISTED);
		}
		User user = User.of(profile.getIntraName(), profile.getEmail(), profile.getBlackHoledAt(), UserRole.USER);
		return userRepository.save(user);
	}

	public User createClubUser(String clubName) {
		log.info("Called createClubUser. {}", clubName);
		if (userRepository.existsByNameAndEmail(clubName, clubName + "@ftclub.org")) {
			log.warn("이미 존재하는 동아리입니다. {}", clubName);
			throw new ServiceException(ExceptionStatus.EXISTED_CLUB_USER);
		}
		User user = User.of(clubName, clubName + "@ftclub.org", null, UserRole.CLUB);
		return userRepository.save(user);
	}

	public void updateClubName(User user, String clubName) {
		log.info("Called updateClubName. {}", user);
		if (!user.isUserRole(UserRole.CLUB))
			throw new ServiceException(ExceptionStatus.NOT_CLUB_USER);
		user.changeName(clubName);
		userRepository.save(user);
	}

	public void deleteById(Long userId) {
		log.info("Called deleteById. {}", userId);
		userRepository.deleteById(userId);
	}

	public void deleteClubUserById(User clubUser) {
		log.info("Called deleteClubUserById. {}", clubUser);
		if (!clubUser.isUserRole(UserRole.CLUB))
			throw new ServiceException(ExceptionStatus.NOT_CLUB_USER);
		userRepository.delete(clubUser);
	}
}
