package org.ftclub.cabinet.user.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserFacadeServiceImpl implements UserFacadeService {

	private final UserService userService;
	private final UserOptionalFetcher userOptionalFetcher;
	private final LentOptionalFetcher lentOptionalFetcher;
	private final UserMapper userMapper;
	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final CabinetMapper cabinetMapper;

	@Override
	public MyProfileResponseDto getMyProfile(UserSessionDto user) {
		log.info("Called getMyProfile: {}", user.getName());
		Cabinet cabinet = lentOptionalFetcher.findActiveLentCabinetByUserId(user.getUserId());
		BanHistory banHistory = userOptionalFetcher.findRecentActiveBanHistory(user.getUserId(),
				DateUtil.getNow());
		return userMapper.toMyProfileResponseDto(user, cabinet, banHistory);
	}

	@Override
	public BlockedUserPaginationDto getAllBanUsers(Integer page, Integer size, Date now) {
		log.info("Called getAllBanUsers");
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<BanHistory> activeBanList = userOptionalFetcher.findPaginationActiveBanHistories(
				pageable, now);
		List<UserBlockedInfoDto> userBlockedInfoDtos = activeBanList.stream().map(
						banHistory -> userMapper.toUserBlockedInfoDto(
								banHistory, userOptionalFetcher.getUser(banHistory.getUserId())))
				.collect(Collectors.toList());
		return userMapper.toBlockedUserPaginationDto(userBlockedInfoDtos,
				activeBanList.getTotalPages());
	}

	private BlockedUserPaginationDto generateBlockedUserPaginationDto(List<BanHistory> banHistories,
			Integer totalPage) {
		List<UserBlockedInfoDto> userBlockedInfoDtoList = banHistories.stream()
				.map(b -> userMapper.toUserBlockedInfoDto(b,
						userOptionalFetcher.getUser(b.getUserId())))
				.collect(Collectors.toList());
		return new BlockedUserPaginationDto(userBlockedInfoDtoList, totalPage);
	}

	@Override
	public UserProfilePaginationDto getUserProfileListByPartialName(String name, Integer page,
			Integer size) {
		log.info("Called getUserProfileListByPartialName: {}", name);
		// todo - size가 0일 때 모든 데이터를 가져오기
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<User> users = userOptionalFetcher.findUsersByPartialName(name, pageable);
		return generateUserProfilePaginationDto(users.getContent(), users.getTotalElements());
	}

	private UserProfilePaginationDto generateUserProfilePaginationDto(List<User> users,
			Long totalLength) {
		List<UserProfileDto> userProfileDtoList = users.stream()
				.map(u -> userMapper.toUserProfileDto(u)).collect(
						Collectors.toList());
		return new UserProfilePaginationDto(userProfileDtoList, totalLength);
	}

	/* 우선 껍데기만 만들어뒀습니다. 해당 메서드에 대해서는 좀 더 논의한 뒤에 구현하는 것이 좋을 것 같습니다. */
	@Override
	public UserCabinetPaginationDto findUserCabinetListByPartialName(String name, Integer page,
			Integer size) {
		log.info("Called findUserCabinetListByPartialName: {}", name);
		// todo - size가 0일 때 모든 데이터를 가져오기
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<User> users = userOptionalFetcher.findUsersByPartialName(name, pageable);
		return new UserCabinetPaginationDto(null, null);
	}

	/* 우선 껍데기만 만들어뒀습니다. 해당 메서드에 대해서는 좀 더 논의한 뒤에 구현하는 것이 좋을 것 같습니다. */
	@Override
	public MyCabinetResponseDto getMyLentAndCabinetInfo(Long userId) {
		log.info("Called getMyLentAndCabinetInfo: {}", userId);
		User user = userOptionalFetcher.findUser(userId);
		return null;
	}

	@Override
	public List<User> getAllUsers() {
		return userOptionalFetcher.findAllUsers();
	}

	@Override
	public boolean checkUserExists(String name) {
		return userService.checkUserExists(name);
	}

	@Override
	public void createUser(String name, String email, Date blackholedAt, UserRole role) {
		userService.createUser(name, email, blackholedAt, role);
	}

	@Override
	public boolean checkAdminUserExists(String email) {
		return userService.checkAdminUserExists(email);
	}

	@Override
	public void createAdminUser(String email) {
		userService.createAdminUser(email);
	}

	@Override
	public void deleteUser(Long userId, Date deletedAt) {
		userService.deleteUser(userId, deletedAt);
	}

	@Override
	public void deleteAdminUser(Long adminUserId) {
		userService.deleteAdminUser(adminUserId);
	}

	@Override
	public void updateAdminUserRole(Long adminUserId, AdminRole role) {
		userService.updateAdminUserRole(adminUserId, role);
	}

	@Override
	public void promoteUserToAdmin(String email) {
		userService.promoteAdminByEmail(email);
	}

	@Override
	public void updateUserBlackholedAt(Long userId, Date newBlackholedAt) {
		userService.updateUserBlackholedAt(userId, newBlackholedAt);
	}

	@Override
	public void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt,
			Date expiredAt) {
		userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);
	}

	@Override
	public void deleteRecentBanHistory(Long userId, Date today) {
		userService.deleteRecentBanHistory(userId, today);
	}

	@Override
	public OverdueUserCabinetPaginationDto getOverdueUserList(Integer page, Integer size) {
		log.info("Called getOverdueUserList");
		List<OverdueUserCabinetDto> overdueList = new ArrayList<>();
		// todo - size가 0일 때 모든 데이터를 가져오기
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		lentOptionalFetcher.findAllOverdueLent(DateUtil.getNow(), pageable).stream().forEach(
				(lh) -> {
					User user = userOptionalFetcher.findUser(lh.getUserId());
					Long overdueDays = DateUtil.calculateTwoDateDiff(DateUtil.getNow(),
							lh.getExpiredAt());
					Cabinet cabinet = cabinetOptionalFetcher.getCabinet(
							lh.getCabinetId());
					overdueList.add(
							cabinetMapper.toOverdueUserCabinetDto(lh, user,
									cabinet, overdueDays));
				}
		);
		return cabinetMapper.toOverdueUserCabinetPaginationDto(overdueList, overdueList.size());
	}
}
