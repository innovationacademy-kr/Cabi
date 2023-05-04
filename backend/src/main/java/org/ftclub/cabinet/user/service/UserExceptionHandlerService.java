package org.ftclub.cabinet.user.service;

<<<<<<< HEAD
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserExceptionHandlerService {

	private final UserRepository userRepository;

	public User getUser(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}

	public User getClubUser(Long userId) {
		User user = getUser(userId);
		if (!user.isUserRole(UserRole.CLUB)) {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_USER);
		}
		return user;
	}
=======
public class UserExceptionHandlerService {

>>>>>>> e1d6a71c ([BE] FEAT : banPolicy 추가 및 기타 userService 메서드 추가 #1038)
}
