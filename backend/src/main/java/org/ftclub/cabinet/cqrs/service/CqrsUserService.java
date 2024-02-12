package org.ftclub.cabinet.cqrs.service;

import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.USER_LENT_INFO;

import com.fasterxml.jackson.core.type.TypeReference;
import io.netty.util.internal.StringUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cqrs.domain.CqrsLockCollection;
import org.ftclub.cabinet.cqrs.respository.CqrsRedis;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

@Service
@Logging(level = LogLevel.DEBUG)
@RequiredArgsConstructor
public class CqrsUserService {

	private final CqrsRedis cqrsRedis;

	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;

	private final CqrsLockCollection cqrsLockCollection;

	//@formatter:off

	public void clearUserLentInfo() {
		cqrsRedis.clearBySuffix(USER_LENT_INFO.getValue());
	}

	public MyCabinetResponseDto getUserLentInfo(Long userId) {
		return cqrsRedis.get(userId.toString() + USER_LENT_INFO.getValue(),
				new TypeReference<MyCabinetResponseDto>() {});
	}

	public void addUserLentInfo(Cabinet cabinet, List<LentHistory> lentHistories,
			String previousUserName) {
		List<LentDto> lentDtos = lentHistories.stream()
				.map(lh -> lentMapper.toLentDto(lh.getUser(), lh))
				.collect(Collectors.toList());
		lentHistories.forEach(lentHistory -> {
			String key = lentHistory.getUser().getId().toString() + USER_LENT_INFO.getValue();
			synchronized (cqrsLockCollection.getLock(USER_LENT_INFO)) {
				MyCabinetResponseDto myCabinetResponseDto =
						cabinetMapper.toMyCabinetResponseDto(cabinet, lentDtos,
								null, null, previousUserName);
				if (StringUtil.isNullOrEmpty(myCabinetResponseDto.getTitle())) {
					myCabinetResponseDto.setTitle(lentHistories.get(0).getUser().getName());
				}

				cqrsRedis.set(key, myCabinetResponseDto);
			}
		});
	}

	public void setSessionUserLentInfo(Cabinet cabinet, List<User> users, String shareCode,
			LocalDateTime sessionExpired, String previousUserName) {
		List<LentDto> lentDtos = users.stream()
				.map(lentMapper::toLentDto).collect(Collectors.toList());
		users.forEach(user -> {
			MyCabinetResponseDto myCabinetResponseDto =
					cabinetMapper.toMyCabinetResponseDto(cabinet, lentDtos, shareCode,
							sessionExpired, previousUserName);
			synchronized (cqrsLockCollection.getLock(USER_LENT_INFO)) {
				cqrsRedis.set(user.getId() + USER_LENT_INFO.getValue(), myCabinetResponseDto);
			}
		});
	}

	public void removeUserLentInfo(Cabinet cabinet, LentHistory lentHistory, List<Long> usersInCabinet) {
		synchronized (cqrsLockCollection.getLock(USER_LENT_INFO)) {
			cqrsRedis.clear(lentHistory.getUserId() + USER_LENT_INFO.getValue());
			usersInCabinet.forEach(userInCabinet -> {
				if (userInCabinet.equals(lentHistory.getUserId())) {
					return;
				}
				String userKey = userInCabinet + USER_LENT_INFO.getValue();
				MyCabinetResponseDto myCabinetResponseDto = cqrsRedis.get(userKey,
						new TypeReference<MyCabinetResponseDto>() {});

				myCabinetResponseDto.getLents()
						.removeIf(l -> l.getUserId().equals(lentHistory.getUserId()));

				cqrsRedis.set(userKey, myCabinetResponseDto);
			});
		}
	}

	//@formatter:on
}
