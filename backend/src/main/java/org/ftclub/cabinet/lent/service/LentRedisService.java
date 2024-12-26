package org.ftclub.cabinet.lent.service;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentRedisService {

	private final LentRedis lentRedis;
	private final LentRepository lentRepository;
	private final CabinetProperties cabinetProperties;


	/*-------------------------------------  Share Cabinet  --------------------------------------*/

	/**
	 * 공유 사물함에 참여 중인 user id를 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함에 참여 중인 user id
	 */
	public List<Long> findUsersInCabinet(Long cabinetId) {
		List<String> userIdList = lentRedis.getAllUserInCabinet(
				cabinetId.toString());
		return userIdList.stream().map(Long::valueOf).collect(Collectors.toList());
	}

	/**
	 * 유저가 참여 중인 공유 사물함 id를 가져옵니다.
	 *
	 * @param userId 유저 id
	 * @return 유저가 참여 중인 공유 사물함 id
	 */
	public Long findCabinetJoinedUser(Long userId) {
		String cabinetId = lentRedis.findCabinetByUser(userId.toString());
		if (Objects.isNull(cabinetId)) {
			return null;
		}
		return Long.valueOf(cabinetId);
	}

	/**
	 * 공유 사물함의 초대 코드를 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 초대 코드
	 */
	public String getShareCode(Long cabinetId) {
		return lentRedis.getShareCode(cabinetId.toString());
	}

	/**
	 * 공유 사물함의 만료 기한을 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 만료 기한
	 */
	public LocalDateTime getSessionExpired(Long cabinetId) {
		return lentRedis.getCabinetExpiredAt(cabinetId.toString());
	}

	/**
	 * 공유 사물함 세션을 새로 생성합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 세션 키
	 */
	public String createCabinetSession(Long cabinetId) {
		return lentRedis.setShadowKey(cabinetId.toString());
	}

	/**
	 * 공유 사물함 세션이 있는지 확인합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함 세션이 있는지 여부
	 */
	public boolean isInCabinetSession(Long cabinetId) {
		return lentRedis.isExistShadowKey(cabinetId.toString());
	}

	/**
	 * 공유 사물함에 유저가 참여 시도한 횟수를 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @param userId    유저 id
	 * @return 유저가 참여 시도한 횟수
	 */
	public Long getAttemptCountOnShareCabinet(Long cabinetId, Long userId) {
		String attemptCount =
				lentRedis.getAttemptCountInCabinet(cabinetId.toString(), userId.toString());
		if (Objects.isNull(attemptCount)) {
			return null;
		}
		return Long.parseLong(attemptCount);
	}

	/**
	 * 공유 사물함에 유저를 참여하도록 시도합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @param userId    유저 id
	 * @param shareCode 공유 사물함 초대 코드
	 */
	public void attemptJoinCabinet(Long cabinetId, Long userId, String shareCode) {
		lentRedis.attemptJoinCabinet(cabinetId.toString(), userId.toString(), shareCode);
	}

	/**
	 * 공유 사물함에 참여 중인 유저의 수가 최대 유저 수인지 확인합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 최대 유저 수인지 여부
	 */
	public boolean isCabinetSessionFull(Long cabinetId) {
		Long userCount = lentRedis.countUserInCabinet(cabinetId.toString());
		return Objects.equals(userCount, cabinetProperties.getShareMaxUserCount());
	}

	/**
	 * 공유 사물함에 참여 중인 모든 유저들을 가져옵니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @return 공유 사물함에 참여 중인 모든 유저들 id {@link List}
	 */
	public List<Long> getUsersInCabinet(Long cabinetId) {
		List<String> userIdList = lentRedis.getAllUserInCabinet(cabinetId.toString());
		return userIdList.stream().map(Long::valueOf).collect(Collectors.toList());
	}

	/**
	 * 공유 사물함에 참여 중인 유저를 삭제합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 * @param userId    유저 id
	 */
	public void deleteUserInCabinet(Long cabinetId, Long userId) {
		String cabinetIdString = cabinetId.toString();
		String userIdString = userId.toString();
		if (!lentRedis.isUserInCabinet(cabinetIdString, userIdString)) {
			throw ExceptionStatus.NOT_FOUND_USER.asServiceException();
		}
		lentRedis.deleteUser(userIdString);
		lentRedis.deleteUserInCabinet(cabinetIdString, userIdString);
		if (lentRedis.countUserInCabinet(cabinetIdString) == 0) {
			lentRedis.deleteShadowKey(cabinetIdString);
			clearCabinetSession(cabinetId);

		}
	}

	/**
	 * 공유 사물함 세션을 확정합니다.
	 *
	 * @param cabinetId  공유 사물함 cabinet id
	 * @param userIdList 유저 id {@link List}
	 */
	public void confirmCabinetSession(Long cabinetId, List<Long> userIdList) {
		String cabinetIdString = cabinetId.toString();
		userIdList.stream().map(Object::toString)
				.forEach(userId -> lentRedis.deleteUserInCabinet(cabinetIdString, userId));
		lentRedis.deleteCabinet(cabinetIdString);
	}

	/**
	 * 공유 사물함 세션을 삭제합니다.
	 *
	 * @param cabinetId 공유 사물함 cabinet id
	 */
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

	/**
	 * 사물함의 이전 대여자 이름을 가져옵니다.
	 *
	 * @param cabinetId 사물함 id
	 * @return 이전 대여자 이름
	 */
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

	/**
	 * 사물함의 이전 대여자 이름을 설정합니다.
	 *
	 * @param cabinetId 사물함 id
	 * @param userName  이전 대여자 이름
	 */
	public void setPreviousUserName(Long cabinetId, String userName) {
		lentRedis.setPreviousUserName(cabinetId.toString(), userName);
	}

	/**
	 * 사물함의 이전 대여 종료 시간을 가져옵니다.
	 *
	 * @param cabinetId 사물함 id
	 * @return 이전 대여 종료 시간
	 */
	public LocalDateTime getPreviousEndedAt(Long cabinetId) {
		LocalDateTime previousEndedAt;
		String previousEndedAtString = lentRedis.getPreviousEndedAt(cabinetId.toString());
		if (Objects.isNull(previousEndedAtString)) {
			Optional<LentHistory> cabinetLastLentHistory =
					lentRepository.findFirstByCabinetIdOrderByEndedAtDesc(cabinetId);
			previousEndedAt = cabinetLastLentHistory.map(LentHistory::getEndedAt).orElse(null);
			if (Objects.nonNull(previousEndedAt)) {
				lentRedis.setPreviousEndedAt(cabinetId.toString(), previousEndedAt.toString());
			}
		} else {
			DateTimeFormatter dateFormatter =
					DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS");
			previousEndedAt = LocalDateTime.parse(previousEndedAtString, dateFormatter);
		}
		return previousEndedAt;
	}

	/**
	 * 사물함의 이전 대여 종료 시간을 설정합니다.
	 *
	 * @param cabinetId 사물함 id
	 * @param endedAt   이전 대여 종료 시간
	 */
	public void setPreviousEndedAt(Long cabinetId, LocalDateTime endedAt) {
		lentRedis.setPreviousEndedAt(cabinetId.toString(), endedAt.toString());
	}

	public LocalDateTime getSwapExpiredAt(Long userId) {
		return lentRedis.getSwapExpiredAt(String.valueOf(userId));
	}

	public boolean isExistSwapRecord(Long userId) {
		return lentRedis.isExistSwapRecord(String.valueOf(userId));
	}

	public void setSwapRecord(Long userId) {
		lentRedis.setSwap(String.valueOf(userId));
	}
}
