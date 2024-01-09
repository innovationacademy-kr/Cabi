package org.ftclub.cabinet.admin.user.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.ClubUserListDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.BanHistoryCommandService;
import org.ftclub.cabinet.user.service.BanHistoryQueryService;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 관리자 페이지에서 사용되는 유저 서비스
 */
@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminUserFacadeService {

	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final BanHistoryQueryService banHistoryQueryService;
	private final BanHistoryCommandService banHistoryCommandService;

	private final UserMapper userMapper;

	/**
	 * 가장 최근의 밴 기록을 제거합니다.
	 */
	public void deleteRecentBanHistory(Long userId, LocalDateTime now) {
		banHistoryQueryService.findRecentActiveBanHistory(userId, now)
				.ifPresent(banHistory -> {
					banHistoryCommandService.deleteRecentBanHistory(banHistory, now);
				});
	}

	/**
	 * 동아리 사용자를 생성합니다.
	 *
	 * @param clubName 동아리 이름
	 * @return 생성된 동아리 사용자
	 */
	public User createClubUser(String clubName) {
		return userCommandService.createClubUser(clubName);
	}

	/**
	 * 동아리 사용자를 삭제합니다.
	 *
	 * @param userId 동아리 사용자 id
	 */
	public void deleteClubUser(Long userId) {
		User clubUser = userQueryService.getClubUser(userId);
		userCommandService.deleteClubUser(clubUser);
	}

	/**
	 * 동아리 사용자를 조회합니다.
	 *
	 * @return 동아리 사용자
	 */
	public ClubUserListDto findAllClubUsers(Pageable pageable) {
		Page<User> clubUsers = userQueryService.findClubUsers(pageable);
		List<UserProfileDto> result = clubUsers.map(userMapper::toUserProfileDto).toList();
		return userMapper.toClubUserListDto(result, clubUsers.getTotalElements());
	}

	/**
	 * 동아리 사용자의 동아리 이름을 변경합니다.
	 *
	 * @param userId   동아리 사용자 id
	 * @param clubName 변경할 동아리 이름
	 */
	public void updateClubUser(Long userId, String clubName) {
		User clubUser = userQueryService.getUser(userId);
		userCommandService.updateClubName(clubUser, clubName);
	}
}
