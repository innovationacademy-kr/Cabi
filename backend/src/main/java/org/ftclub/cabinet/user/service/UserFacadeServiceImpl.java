package org.ftclub.cabinet.user.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.service.CabinetExceptionHandlerService;
import org.ftclub.cabinet.dto.BlockedUserDto;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetInfoResponseDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanPolicy;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {

	private final UserService userService;
	private final UserExceptionHandlerService userExceptionHandlerService;
	private final LentRepository lentRepository;
	private final BanHistoryRepository banHistoryRepository;
	private final BanPolicy banPolicy;
	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final CabinetExceptionHandlerService cabinetExceptionHandlerService;
	private final CabinetMapper cabinetMapper;

	@Override
	public MyProfileResponseDto getMyProfile(UserSessionDto user) {
		Optional<LentHistory> lentHistory = lentRepository.findFirstByUserIdAndEndedAtIsNull(
				user.getUserId());
		Long cabinetId = lentHistory.map(LentHistory::getCabinetId).orElse(-1L);
		Date unbannedAt = banHistoryRepository.findRecentBanHistoryByUserId(user.getUserId())
				.map(BanHistory::getUnbannedAt).orElse(null);
		if (unbannedAt != null && banPolicy.isActiveBanHistory(unbannedAt, DateUtil.getNow())) {
			unbannedAt = null;
		}
		return new MyProfileResponseDto(user.getUserId(), user.getName(), cabinetId, unbannedAt);
	}

	@Override
	public BlockedUserPaginationDto getAllBanUsers(Integer page, Integer length, Date now) {
		PageRequest pageable = PageRequest.of(page, length);
		Page<BanHistory> activeBanList = banHistoryRepository.findActiveBanList(pageable,
				now);
		return generateBlockedUserPaginationDto(activeBanList.getContent(),
				activeBanList.getTotalElements());
	}

	private BlockedUserPaginationDto generateBlockedUserPaginationDto(List<BanHistory> banHistories,
			Long totalLength) {
		List<BlockedUserDto> blockedUserDtoList = banHistories.stream()
				.map(b -> userMapper.toBlockedUserDto(b,
						userExceptionHandlerService.getUser(b.getUserId()).getName()))
				.collect(Collectors.toList());
		return new BlockedUserPaginationDto(blockedUserDtoList, totalLength);
	}

	@Override
	public UserProfilePaginationDto getUserProfileListByPartialName(String name, Integer page,
			Integer length) {
		PageRequest pageable = PageRequest.of(page, length);
		Page<User> users = userRepository.findByPartialName(name, pageable);
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
			Integer length) {
		PageRequest pageable = PageRequest.of(page, length);
		Page<User> users = userRepository.findByPartialName(name, pageable);
		return new UserCabinetPaginationDto(null, null);
	}

	/* 우선 껍데기만 만들어뒀습니다. 해당 메서드에 대해서는 좀 더 논의한 뒤에 구현하는 것이 좋을 것 같습니다. */
	@Override
	public MyCabinetInfoResponseDto getMyLentAndCabinetInfo(Long userId) {
		User user = userRepository.getUser(userId);
		return new MyCabinetInfoResponseDto(null, null, null, null, null, null, null, null, null);
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
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
	public OverdueUserCabinetPaginationDto getOverdueUserList(Integer page, Integer length) {
		List<OverdueUserCabinetDto> overdueList = new ArrayList<>();
		PageRequest pageable = PageRequest.of(page, length);
		lentRepository.findAllOverdueLent(DateUtil.getNow(), pageable).stream().forEach(
				(lh) -> {
					String userName = userRepository.findNameById(lh.getUserId());
					Location location = cabinetExceptionHandlerService.getLocation(
							lh.getCabinetId());
					Long overdueDays = DateUtil.calculateTwoDateDiff(lh.getExpiredAt(),
							DateUtil.getNow());
					overdueList.add(
							cabinetMapper.toOverdueUserCabinetDto(lh, userName, location,
									overdueDays));
				}
		);
		return cabinetMapper.toOverdueUserCabinetPaginationDto(overdueList, overdueList.size());
	}
}
