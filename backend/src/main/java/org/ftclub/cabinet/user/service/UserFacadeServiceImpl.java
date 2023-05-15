package org.ftclub.cabinet.user.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.BlockedUserDto;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetInfoResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {

	private final UserService userService;
	private final LentRepository lentRepository;
	private final BanHistoryRepository banHistoryRepository;
	private final UserRepository userRepository;
	private final UserMapper userMapper;

	@Override
	public MyProfileResponseDto getMyProfile(UserSessionDto user) {
		Optional<LentHistory> lentHistory = lentRepository.findFirstByUserIdAndEndedAtIsNull(
				user.getUserId());
		Long cabinetId;
		if (lentHistory.isPresent()) {
			cabinetId = lentHistory.get().getCabinetId();
		} else {
			cabinetId = -1L;
		}
		return new MyProfileResponseDto(user.getUserId(), user.getName(), cabinetId);
	}

	@Override
	public BlockedUserPaginationDto getAllBanUsers(Integer page, Integer length) {
		PageRequest pageRequest = PageRequest.of(page, length);
		Page<BanHistory> activeBanList = banHistoryRepository.findActiveBanList(pageRequest);
		List<BlockedUserDto> blockedUserDtoList = activeBanList.stream()
				.map(b -> userMapper.toBlockedUserDto(b,
						userRepository.findNameById(b.getUserId())))
				.collect(Collectors.toList());
		return new BlockedUserPaginationDto(blockedUserDtoList, blockedUserDtoList.size());
	}

	@Override
	public UserProfilePaginationDto getUserProfileListByPartialName(String name, Integer page,
			Integer length) {
		PageRequest pageRequest = PageRequest.of(page, length);
		Page<User> users = userRepository.findByPartialName(name, pageRequest);
		List<UserProfileDto> userProfileDtoList = users.stream()
				.map(u -> userMapper.toUserProfileDto(u)).collect(
						Collectors.toList());
		return new UserProfilePaginationDto(userProfileDtoList, userProfileDtoList.size());
	}

	@Override
	public UserCabinetPaginationDto findUserCabinetListByPartialName(String name, Integer page,
			Integer length) {
		PageRequest pageRequest = PageRequest.of(page, length);
		Page<User> users = userRepository.findByPartialName(name, pageRequest);
		// UserCabinetPaginationDto 만드는 로직
		// 우선 작성
		return new UserCabinetPaginationDto(null, null);
	}

	@Override
	public LentHistoryPaginationDto getUserLentHistories(Long userId, Integer page,
			Integer length) {
		PageRequest pageRequest = PageRequest.of(page, length);
		// user service에서..?
		// 우선 작성
		return new LentHistoryPaginationDto(null, null);
	}

	@Override
	public MyCabinetInfoResponseDto getMyLentAndCabinetInfo(Long userId) {
		User user = userRepository.getUser(userId);
		// MyCabinetInfoResponseDto 로 바꾸는 로직..
		// 우선 작성
		return new MyCabinetInfoResponseDto(null, null, null, null, null, null, null, null, null);
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
	public void deleteUser(Long userId) {
		userService.deleteUser(userId);
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
	public void updateUserBlackholedAtById(Long userId, Date newBlackholedAt) {
		userService.updateUserBlackholedAtById(userId, newBlackholedAt);
	}

	@Override
	public void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt,
			Date expiredAt) {
		userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);
	}

	@Override
	public void unbanUser(Long userId) {
		userService.unbanUser(userId);
	}

	@Override
	public boolean checkUserIsBanned(Long userId) {
		return userService.checkUserIsBanned(userId);
	}
}
