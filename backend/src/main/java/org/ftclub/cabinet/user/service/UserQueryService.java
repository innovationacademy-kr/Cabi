package org.ftclub.cabinet.user.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class UserQueryService {

	private final UserRepository userRepository;

	/**
	 * 유저를 가져옵니다.
	 *
	 * @param userId 유저의 ID
	 * @return 유저 객체를 반환합니다.
	 */
	public User getUser(Long userId) {
		Optional<User> user = userRepository.findById(userId);
		return user.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
	}

	/**
	 * 동아리 유저를 가져옵니다.
	 *
	 * @param userId 동아리 유저의 ID
	 * @return 동아리 유저 객체를 반환합니다.
	 */
//	public User getClubUser(Long userId) {
//		Optional<User> user = userRepository.findByIdAndRole(userId, UserRole.CLUB);
//		return user.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
//	}

	/**
	 * 유저를 가져옵니다.
	 *
	 * @param name 유저의 이름
	 * @return 유저 객체를 반환합니다.
	 */
	public User getUserByName(String name) {
		Optional<User> user = userRepository.findByName(name);
		return user.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
	}

	/**
	 * 유저들을 가져옵니다.
	 *
	 * @param userIds 유저들의 ID
	 * @return 유저 객체들을 반환합니다.
	 */
	public List<User> findUsers(List<Long> userIds) {
		return userRepository.findAllByIds(userIds);
	}

	/**
	 * 유저들을 가져옵니다.
	 *
	 * @param userIds  유저들의 ID
	 * @param pageable 페이징 정보
	 * @return 유저 객체들을 페이지 형식으로 반환합니다.
	 */
	public Page<User> findUsers(List<Long> userIds, Pageable pageable) {
		return userRepository.findPaginationByIds(userIds, pageable);
	}

	/**
	 * 유저들을 가져옵니다.
	 *
	 * @param partialName 유저 이름의 일부분
	 * @param pageable    페이징 정보
	 * @return 유저 객체들을 페이지 형식으로 반환합니다.
	 */
	public Page<User> findUsers(String partialName, Pageable pageable) {
		return userRepository.findPaginationByPartialName(partialName, pageable);
	}

	/**
	 * 유저를 가져옵니다.
	 *
	 * @param name 유저의 이름
	 * @return 유저 객체를 optional 형식으로 반환합니다.
	 */
	public Optional<User> findUser(String name) {
		return userRepository.findByName(name);
	}

	/**
	 * 유저를 가져옵니다.
	 *
	 * @param email 유저의 이메일
	 * @return 유저 객체를 optional 형식으로 반환합니다.
	 */
	public Optional<User> findUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	/**
	 * 유저를 가져옵니다.
	 *
	 * @param name 유저의 이름
	 * @return 유저 객체를 optional 형식으로 반환합니다.
	 */
	public Optional<User> findUserByName(String name) {
		return userRepository.findByName(name);
	}

	/**
	 * 동아리 유저들을 가져옵니다.
	 *
	 * @param pageable 페이징 정보
	 * @return 동아리 유저 객체들을 페이지 형식으로 반환합니다.
	 */
//	public Page<User> findClubUsers(Pageable pageable) {
//		return userRepository.findAllByRoleAndDeletedAtIsNull(UserRole.CLUB, pageable);
//	}

	/**
	 * 블랙홀에 빠질 위험이 있는 유저들을 가져옵니다. blackholedAt이 일주일 이하인 유저들을 블랙홀에 빠질 위험이 있는 유저로 판단합니다.
	 *
	 * @return 유저 객체들을 반환합니다.
	 */
	public List<User> findUsersAtRiskOfBlackhole() {
		final LocalDateTime afterSevenDaysFromNow = LocalDateTime.now().plusDays(7);
		return userRepository.findByBlackholedAtLessThanOrEqual(afterSevenDaysFromNow);
	}

	/**
	 * 블랙홀에 빠질 위험이 없는 유저들의 정보를 조회합니다. blackholedAt이 null이거나 7일 이상 남아있는 유저들을 블랙홀에 빠질 위험이 없는 유저로
	 * 판단합니다.
	 *
	 * @return 유저 객체들을 반환합니다.
	 */
	public List<User> findUsersAtNoRiskOfBlackhole() {
		final LocalDateTime afterSevenDaysFromNow = LocalDateTime.now().plusDays(7);
		return userRepository.findByBlackholedAtAfter(afterSevenDaysFromNow);
	}


	/**
	 * 모든 존재하는 유저를 intra 이름 으로 찾아서 가져옵니다.
	 *
	 * @param userNames
	 * @return 유저 객체들을 반환합니다.
	 */
	public List<User> findAllUsersByNames(List<String> userNames) {
		return userRepository.findAllUsersInNames(userNames);

	}
}
