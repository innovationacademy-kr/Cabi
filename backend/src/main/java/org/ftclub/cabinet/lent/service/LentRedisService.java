package org.ftclub.cabinet.lent.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRedis;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentRedisService {

	private final LentRedis lentRedis;
	private final LentRepository lentRepository;
	private final CabinetProperties cabinetProperties;


	/*-------------------------------------  Share Cabinet  --------------------------------------*/

	public List<Long> findUsersInCabinet(Long cabinetId) {
		List<String> userIdList = lentRedis.getAllUserInCabinet(
				cabinetId.toString());
		return userIdList.stream().map(Long::valueOf).collect(Collectors.toList());
	}

	public Long findCabinetJoinedUser(Long userId) {
		String cabinetId = lentRedis.findCabinetByUser(userId.toString());
		if (Objects.isNull(cabinetId)) {
			return null;
		}
		return Long.valueOf(cabinetId);
	}

	public String getShareCode(Long cabinetId) {
		return lentRedis.getShareCode(cabinetId.toString());
	}

	public LocalDateTime getSessionExpired(Long cabinetId) {
		return lentRedis.getCabinetExpiredAt(cabinetId.toString());
	}

	public String createCabinetSession(Long cabinetId) {
		return lentRedis.setShadowKey(cabinetId.toString());
	}

	public boolean isInCabinetSession(Long cabinetId) {
		return lentRedis.isExistShadowKey(cabinetId.toString());
	}

	public Long getAttemptCountOnShareCabinet(Long cabinetId, Long userId) {
		String attemptCount =
				lentRedis.getAttemptCountInCabinet(cabinetId.toString(), userId.toString());
		if (Objects.isNull(attemptCount)) {
			return null;
		}
		return Long.parseLong(attemptCount);
	}

	public void joinCabinetSession(Long cabinetId, Long userId, String shareCode) {
		lentRedis.attemptJoinCabinet(cabinetId.toString(), userId.toString(), shareCode);
	}

	public boolean isCabinetSessionEmpty(Long cabinetId) {
		return lentRedis.countUserInCabinet(cabinetId.toString()) == 0;
	}

	public boolean isCabinetSessionFull(Long cabinetId) {
		Long userCount = lentRedis.countUserInCabinet(cabinetId.toString());
		return Objects.equals(userCount, cabinetProperties.getShareMaxUserCount());
	}

	public List<Long> getUsersInCabinetSession(Long cabinetId) {
		List<String> userIdList = lentRedis.getAllUserInCabinet(cabinetId.toString());
		return userIdList.stream().map(Long::valueOf).collect(Collectors.toList());
	}

	public void deleteUserInCabinetSession(Long cabinetId, Long userId) {
		String cabinetIdString = cabinetId.toString();
		String userIdString = userId.toString();
		if (!lentRedis.isUserInCabinet(cabinetIdString, userIdString)) {
			throw ExceptionStatus.NOT_FOUND_USER.asServiceException();
		}
		lentRedis.deleteUser(userIdString);
		lentRedis.deleteUserInCabinet(cabinetIdString, userIdString);
		if (lentRedis.countUserInCabinet(cabinetIdString) == 0) {
			lentRedis.deleteShadowKey(cabinetIdString);
		}
	}

	public void confirmCabinetSession(Long cabinetId, List<Long> userIdList) {
		String cabinetIdString = cabinetId.toString();
		userIdList.stream().map(Object::toString)
				.forEach(userId -> lentRedis.deleteUserInCabinet(cabinetIdString, userId));
		lentRedis.deleteCabinet(cabinetIdString);
	}

	public void clearCabinetSession(Long cabinetId) {
		String cabinetIdString = cabinetId.toString();
		List<String> userList = lentRedis.getAllUserInCabinet(cabinetIdString);
		lentRedis.deleteShadowKey(cabinetIdString);
		userList.forEach(userId -> {
			lentRedis.deleteUserInCabinet(cabinetIdString, userId);
			lentRedis.deleteUser(userId);
		});
		lentRedis.deleteCabinet(cabinetIdString);
	}

	/*----------------------------------------  Caching  -----------------------------------------*/

	public String getPreviousUserName(Long cabinetId) {
		String previousUserName = lentRedis.getPreviousUserName(cabinetId.toString());
		if (Objects.isNull(previousUserName)) {
			List<LentHistory> cabinetLentHistories =
					lentRepository.findByCabinetIdAndEndedAtIsNotNull(cabinetId);
			previousUserName = cabinetLentHistories.stream()
					.sorted(Comparator.comparing(LentHistory::getEndedAt).reversed())
					.limit(1L).map(lh -> lh.getUser().getName())
					.findFirst().orElse(null);
			if (Objects.nonNull(previousUserName)) {
				lentRedis.setPreviousUserName(cabinetId.toString(), previousUserName);
			}
		}
		return previousUserName;
	}

	public void setPreviousUserName(Long cabinetId, String userName) {
		lentRedis.setPreviousUserName(cabinetId.toString(), userName);
	}
}
