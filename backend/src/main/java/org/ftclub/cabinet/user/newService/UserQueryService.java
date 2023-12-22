package org.ftclub.cabinet.user.newService;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserQueryService {

	private final UserRepository userRepository;

	public User getUser(Long userId) {
		Optional<User> user = userRepository.findById(userId);
		return user.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}

	public List<User> getUsers(List<Long> userIdsInCabinet) {
		return userRepository.findAllByIds(userIdsInCabinet);
	}

	public Page<User> getUsers(String partialName, Pageable pageable) {
		return userRepository.findPaginationByPartialName(partialName, pageable);
	}

	public User findUser(String name) {
		Optional<User> user = userRepository.findByName(name);
		return user.orElse(null);
	}
}
