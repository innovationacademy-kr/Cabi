package org.ftclub.cabinet.user.newService;

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

	public void createUser(User user) {
		userRepository.save(user);
	}
}
