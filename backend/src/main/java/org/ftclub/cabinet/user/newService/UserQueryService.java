package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserQueryService {

	private final UserRepository userRepository;

	public User getUser(Long userId) {
		Optional<User> user = userRepository.findById(userId);
		return user.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}

	public User getClubUser(Long userId) {
		Optional<User> user = userRepository.findByIdAndRole(userId, UserRole.CLUB);
		return user.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}

	public User getUserByName(String name) {
		Optional<User> user = userRepository.findByName(name);
		return user.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}

	public List<User> getUsers(List<Long> userIdsInCabinet) {
		return userRepository.findAllByIds(userIdsInCabinet);
	}

	public Page<User> getUsers(String partialName, Pageable pageable) {
		return userRepository.findPaginationByPartialName(partialName, pageable);
	}

	public Optional<User> findUser(String name) {
		return userRepository.findByName(name);
	}

	public Page<User> findClubUsers(Pageable pageable) {
		return userRepository.findAllByRoleAndDeletedAtIsNull(UserRole.CLUB, pageable);
	}
}
