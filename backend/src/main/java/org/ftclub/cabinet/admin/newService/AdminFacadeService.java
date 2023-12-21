package org.ftclub.cabinet.admin.newService;

import static java.util.stream.Collectors.toList;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminFacadeService {

	private final AdminQueryService adminQueryService;
	private final AdminCommandService adminCommandService;
	private final CabinetQueryService cabinetQueryService;
	private final UserQueryService userQueryService;
	private final BanHistoryQueryService banHistoryQueryService;
	private final LentQueryService lentQueryService;
	private final LentRedisService lentRedisService;

	private final CabinetMapper cabinetMapper;
	private final UserMapper userMapper;
	private final LentMapper lentMapper;


	@Transactional(readOnly = true)
	public CabinetSimplePaginationDto getCabinetsSimpleInfo(Integer visibleNum) {
		log.debug("Called getCabinetSimpleInfo {}", visibleNum);

		List<Cabinet> cabinets = cabinetQueryService.getCabinets(visibleNum);
		List<CabinetSimpleDto> result = cabinets.stream()
				.map(cabinetMapper::toCabinetSimpleDto).collect(toList());
		return cabinetMapper.toCabinetSimplePaginationDto(result, (long) cabinets.size());
	}

	@Transactional(readOnly = true)
	public CabinetInfoPaginationDto getCabinetInfo(Integer visibleNum) {
		log.debug("Called getCabinetInfo {}", visibleNum);

		List<Cabinet> cabinets = cabinetQueryService.getCabinets(visibleNum);
		List<Long> cabinetIds = cabinets.stream().map(Cabinet::getCabinetId)
				.collect(toList());
		List<LentHistory> lentHistories =
				lentQueryService.findCabinetsActiveLentHistories(cabinetIds);
		Map<Long, List<LentHistory>> lentHistoriesByCabinetId = lentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getCabinetId));

		List<CabinetInfoResponseDto> result = cabinets.stream()
				.map(cabinet -> {
					Long cabinetId = cabinet.getCabinetId();
					List<LentDto> lents = lentHistoriesByCabinetId.get(cabinetId).stream()
							.map(lh -> lentMapper.toLentDto(lh.getUser(), lh)).collect(toList());
					LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);
					return cabinetMapper.toCabinetInfoResponseDto(cabinet, lents, sessionExpiredAt);
				}).sorted(Comparator.comparingInt(o -> o.getLocation().getFloor()))
				.collect(toList());
		return cabinetMapper.toCabinetInfoPaginationDto(result, (long) cabinets.size());
	}

	@Transactional(readOnly = true)
	public UserProfilePaginationDto getUsersProfile(String partialName, Pageable pageable) {
		log.debug("Called getUsersProfile {}", partialName);

		Page<User> users = userQueryService.getUsers(partialName, pageable);
		List<UserProfileDto> result = users.stream()
				.map(userMapper::toUserProfileDto).collect(toList());
		return userMapper.toUserProfilePaginationDto(result, users.getTotalElements());
	}

	@Transactional(readOnly = true)
	public UserCabinetPaginationDto getUserLentCabinetInfo(String partialName,
			Pageable pageable) {
		log.debug("Called getUserLentCabinetInfo {}", partialName);

		LocalDateTime now = LocalDateTime.now();
		Page<User> users = userQueryService.getUsers(partialName, pageable);
		List<Long> userIds = users.stream().map(User::getUserId).collect(toList());
		System.out.println("userIds = " + userIds);

		List<BanHistory> activeBanHistories =
				banHistoryQueryService.findActiveBanHistories(userIds, now);
		System.out.println("activeBanHistories = " + activeBanHistories);
		List<LentHistory> activeLentHistories =
				lentQueryService.findUsersActiveLentHistoriesAndCabinet(userIds);
		System.out.println("activeLentHistories = " + activeLentHistories);
		Map<Long, List<BanHistory>> banHistoriesByUserId = activeBanHistories.stream()
				.collect(Collectors.groupingBy(BanHistory::getUserId));
		System.out.println("banHistoriesByUserId = " + banHistoriesByUserId);
		Map<Long, List<LentHistory>> lentHistoriesByUserId = activeLentHistories.stream()
				.collect(Collectors.groupingBy(LentHistory::getUserId));
		System.out.println("lentHistoriesByUserId = " + lentHistoriesByUserId);

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
}
