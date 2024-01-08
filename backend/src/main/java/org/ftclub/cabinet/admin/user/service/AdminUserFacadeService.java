package org.ftclub.cabinet.admin.user.service;

import java.time.LocalDateTime;
import java.util.List;
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

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminUserFacadeService {

	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final BanHistoryQueryService banHistoryQueryService;
	private final BanHistoryCommandService banHistoryCommandService;

	private final UserMapper userMapper;

	public void deleteRecentBanHistory(Long userId, LocalDateTime now) {
		banHistoryQueryService.findRecentActiveBanHistory(userId, now)
				.ifPresent(banHistory -> {
					banHistoryCommandService.deleteRecentBanHistory(banHistory, now);
				});
	}

	public User createClubUser(String clubName) {
		return userCommandService.createClubUser(clubName);
	}

	public void deleteClubUser(Long userId) {
		User clubUser = userQueryService.getClubUser(userId);
		userCommandService.deleteClubUserById(clubUser);
	}

	public ClubUserListDto findAllClubUsers(Pageable pageable) {
		Page<User> clubUsers = userQueryService.findClubUsers(pageable);
		List<UserProfileDto> result = clubUsers.map(userMapper::toUserProfileDto).toList();
		return userMapper.toClubUserListDto(result, clubUsers.getTotalElements());
	}

	public void updateClubUser(Long userId, String clubName) {
		User clubUser = userQueryService.getUser(userId);
		userCommandService.updateClubName(clubUser, clubName);
	}
}
