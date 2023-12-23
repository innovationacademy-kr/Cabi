package org.ftclub.cabinet.admin.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.ClubUserListDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.newService.BanHistoryCommandService;
import org.ftclub.cabinet.user.newService.BanHistoryQueryService;
import org.ftclub.cabinet.user.newService.UserCommandService;
import org.ftclub.cabinet.user.newService.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class AdminUserFacadeService {
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final BanHistoryQueryService banHistoryQueryService;
	private final BanHistoryCommandService banHistoryCommandService;

	private final UserMapper userMapper;

	public void deleteRecentBanHistory(Long userId, LocalDateTime now) {
		log.debug("Called deleteRecentBanHistory: {}", userId);
		banHistoryQueryService.findRecentActiveBanHistory(userId, now)
				.ifPresent(banHistory -> {
					banHistoryCommandService.deleteRecentBanHistory(banHistory, now);
				});
	}

	public User createClubUser(String clubName) {
		log.debug("Called createClubUser: {}", clubName);
		return userCommandService.createClubUser(clubName);
	}

	public void deleteClubUser(Long userId) {
		log.debug("Called deleteClubUser: {}", userId);
		User clubUser = userQueryService.getClubUser(userId);
		userCommandService.deleteClubUserById(clubUser);
	}

	public ClubUserListDto findAllClubUsers(Pageable pageable) {
		log.debug("Called getClubUserList");
		Page<User> clubUsers = userQueryService.findClubUsers(pageable);
		List<UserProfileDto> result = clubUsers.map(userMapper::toUserProfileDto).toList();
		return userMapper.toClubUserListDto(result, clubUsers.getTotalElements());
	}

	public void updateClubUser(Long userId, String clubName) {
		log.debug("Called updateClubUser: {}", userId);
		User clubUser = userQueryService.getUser(userId);
		userCommandService.updateClubName(clubUser, clubName);
	}
}
