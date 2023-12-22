package org.ftclub.cabinet.lent.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRedis;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LentRedisService {

	private final LentRedis lentRedis;
	private final LentRepository lentRepository;
	private final CabinetProperties cabinetProperties;

	public List<Long> findUsersInCabinet(Long cabinetId) {
		log.debug("findUsersInCabinet: {}", cabinetId);

		List<String> userIdList = lentRedis.getAllUserInCabinet(
				cabinetId.toString());
		return userIdList.stream().map(Long::valueOf).collect(Collectors.toList());
	}

	public Long findCabinetJoinedUser(Long userId) {
		log.debug("findCabinetJoinedUser: {}", userId);

		String cabinetId = lentRedis.findCabinetByUser(userId.toString());
		if (Objects.isNull(cabinetId)) {
			return null;
		}
		return Long.valueOf(cabinetId);
	}

	public String getShareCode(Long cabinetId) {
		log.debug("getShareCode: {}", cabinetId);

		return lentRedis.getShareCode(cabinetId.toString());
	}

	public LocalDateTime getSessionExpired(Long cabinetId) {
		log.debug("getSessionExpired: {}", cabinetId);

		return lentRedis.getCabinetExpiredAt(cabinetId.toString());
	}

	public String createCabinetSession(Long cabinetId) {
		log.debug("createCabinetSession: {}", cabinetId);

		return lentRedis.setShadowKey(cabinetId.toString());
	}

	public boolean isInCabinetSession(Long cabinetId) {
		log.debug("isInCabinetSession: {}", cabinetId);

		return lentRedis.isExistShadowKey(cabinetId.toString());
	}

	public Long getAttemptCountOnShareCabinet(Long cabinetId, Long userId) {
		log.debug("getAttemptCountOnShareCabinet: {}, {}", cabinetId, userId);

		String attemptCount =
				lentRedis.getAttemptCountInCabinet(cabinetId.toString(), userId.toString());
		if (Objects.isNull(attemptCount)) {
			return null;
		}
		return Long.parseLong(attemptCount);
	}

	public void joinCabinetSession(Long cabinetId, Long userId, String shareCode) {
		log.debug("joinCabinetSession: {}, {}, {}", cabinetId, userId, shareCode);

		lentRedis.attemptJoinCabinet(cabinetId.toString(), userId.toString(), shareCode);
	}

	public boolean isCabinetSessionEmpty(Long cabinetId) {
		log.debug("isCabinetSessionEmpty: {}", cabinetId);

		return lentRedis.countUserInCabinet(cabinetId.toString()) == 0;
	}

	public boolean isCabinetSessionFull(Long cabinetId) {
		log.debug("isCabinetSessionFull: {}", cabinetId);

		Long userCount = lentRedis.countUserInCabinet(cabinetId.toString());
		return Objects.equals(userCount, cabinetProperties.getShareMaxUserCount());
	}

	public List<Long> getUsersInCabinetSession(Long cabinetId) {
		log.debug("getUsersInCabinetSession: {}", cabinetId);

		List<String> userIdList = lentRedis.getAllUserInCabinet(cabinetId.toString());
		return userIdList.stream().map(Long::valueOf).collect(Collectors.toList());
	}

	public void deleteUserInCabinetSession(Long cabinetId, Long userId) {
		log.debug("deleteUserInCabinetSession: {}, {}", cabinetId, userId);

		String cabinetIdString = cabinetId.toString();
		String userIdString = userId.toString();
		if (!lentRedis.isUserInCabinet(cabinetIdString, userIdString)) {
			throw new DomainException(ExceptionStatus.NOT_FOUND_USER);
		}
		lentRedis.deleteUserInCabinet(cabinetIdString, userIdString);
		if (lentRedis.countUserInCabinet(cabinetIdString) == 0) {
			lentRedis.deleteShadowKey(cabinetIdString);
		}
	}

	public void confirmCabinetSession(Long cabinetId, List<Long> userIdList) {
		log.debug("confirmCabinetSession: {}, {}", cabinetId, userIdList);

		String cabinetIdString = cabinetId.toString();
		userIdList.stream().map(Object::toString)
				.forEach(userId -> lentRedis.deleteUserInCabinet(cabinetIdString, userId));
		lentRedis.deleteCabinet(cabinetIdString);
	}

	public void clearCabinetSession(Long cabinetId) {
		log.debug("clearCabinetSession: {}", cabinetId);

		String cabinetIdString = cabinetId.toString();
		List<String> userList = lentRedis.getAllUserInCabinet(cabinetIdString);
		lentRedis.deleteShadowKey(cabinetIdString);
		userList.forEach(userId -> lentRedis.deleteUserInCabinet(cabinetIdString, userId));
		lentRedis.deleteCabinet(cabinetIdString);
	}

	public String getPreviousUserName(Long cabinetId) {
		log.debug("getPreviousUserName: {}", cabinetId);

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
		log.debug("setPreviousUserName: {}, {}", cabinetId, userName);

		lentRedis.setPreviousUserName(cabinetId.toString(), userName);
	}
}
