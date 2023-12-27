package org.ftclub.cabinet.admin.search.service;

import static java.util.stream.Collectors.toList;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.IN_SESSION;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetSimpleDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.dto.UserCabinetDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.newService.BanHistoryQueryService;
import org.ftclub.cabinet.user.newService.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
@Transactional(readOnly = true)
public class AdminSearchFacadeService {

	private final UserQueryService userQueryService;
	private final CabinetQueryService cabinetQueryService;
	private final BanHistoryQueryService banHistoryQueryService;
	private final LentQueryService lentQueryService;
	private final LentRedisService lentRedisService;


	private final CabinetMapper cabinetMapper;
	private final UserMapper userMapper;
	private final LentMapper lentMapper;

	public UserProfilePaginationDto getUsersProfile(String partialName, Pageable pageable) {
		Page<User> users = userQueryService.getUsers(partialName, pageable);
		List<UserProfileDto> result = users.stream()
				.map(userMapper::toUserProfileDto).collect(toList());
		return userMapper.toUserProfilePaginationDto(result, users.getTotalElements());
	}

	public UserCabinetPaginationDto getUserLentCabinetInfo(String partialName, Pageable pageable) {
		LocalDateTime now = LocalDateTime.now();
		Page<User> users = userQueryService.getUsers(partialName, pageable);
		List<Long> userIds = users.stream().map(User::getUserId).collect(toList());

		List<BanHistory> activeBanHistories =
				banHistoryQueryService.findActiveBanHistories(userIds, now);
		List<LentHistory> activeLentHistories =
				lentQueryService.findUsersActiveLentHistoriesAndCabinet(userIds);
		Map<Long, List<BanHistory>> banHistoriesByUserId = activeBanHistories.stream()
				.collect(Collectors.groupingBy(BanHistory::getUserId));
		Map<Long, List<LentHistory>> lentHistoriesByUserId = activeLentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getUserId));

		List<UserCabinetDto> result = users.stream().map(user -> {
			List<BanHistory> banHistories = banHistoriesByUserId.get(user.getUserId());
			List<LentHistory> lentHistories = lentHistoriesByUserId.get(user.getUserId());
			BanHistory banHistory = (Objects.nonNull(banHistories) && !banHistories.isEmpty())
					? banHistories.get(0) : null;
			Cabinet cabinet = (Objects.nonNull(lentHistories) && !lentHistories.isEmpty())
					? lentHistories.get(0).getCabinet() : null;
			UserBlockedInfoDto blockedInfoDto = userMapper.toUserBlockedInfoDto(banHistory, user);
			CabinetDto cabinetDto = cabinetMapper.toCabinetDto(cabinet);
			return cabinetMapper.toUserCabinetDto(blockedInfoDto, cabinetDto);
		}).collect(toList());
		return cabinetMapper.toUserCabinetPaginationDto(result, users.getTotalElements());
	}

	public CabinetSimplePaginationDto getCabinetsSimpleInfo(Integer visibleNum) {
		List<Cabinet> cabinets = cabinetQueryService.findCabinets(visibleNum);
		List<CabinetSimpleDto> result = cabinets.stream()
				.map(cabinetMapper::toCabinetSimpleDto).collect(toList());
		return cabinetMapper.toCabinetSimplePaginationDto(result, (long) cabinets.size());
	}

	public CabinetInfoPaginationDto getCabinetInfo(Integer visibleNum) {
		List<Cabinet> cabinets = cabinetQueryService.findCabinets(visibleNum);
		List<Long> cabinetIds = cabinets.stream().map(Cabinet::getCabinetId).collect(toList());
		List<LentHistory> lentHistories =
				lentQueryService.findCabinetsActiveLentHistories(cabinetIds);
		Map<Long, List<LentHistory>> lentHistoriesByCabinetId = lentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getCabinetId));

		List<CabinetInfoResponseDto> result = cabinets.stream()
				.map(cabinet -> {
					Long cabinetId = cabinet.getCabinetId();
					List<LentDto> lents = null;
					if (lentHistoriesByCabinetId.containsKey(cabinetId)) {
						lents = lentHistoriesByCabinetId.get(cabinetId).stream()
								.map(lh -> lentMapper.toLentDto(lh.getUser(), lh))
								.collect(toList());
					} else if (cabinet.isStatus(IN_SESSION)) {
						List<Long> usersInCabinet =
								lentRedisService.findUsersInCabinet(cabinet.getCabinetId());
						List<User> users = userQueryService.getUsers(usersInCabinet);
						lents = users.stream().map(user -> lentMapper.toLentDto(user, null))
								.collect(toList());
					}
					LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);
					return cabinetMapper.toCabinetInfoResponseDto(cabinet, lents, sessionExpiredAt);
				})
				.sorted(Comparator.comparingInt(o -> o.getLocation().getFloor()))
				.collect(toList());
		return cabinetMapper.toCabinetInfoPaginationDto(result, (long) cabinets.size());
	}
}
