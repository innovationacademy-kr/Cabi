package org.ftclub.cabinet.lent.service;

import java.util.List;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;

/**
 * 대여 관련된 서비스
 */
public interface LentService {

	/**
	 * 사물함 대여를 합니다.
	 *
	 * @param userId    대여하려는 일반 user id
	 * @param cabinetId 대여하려는 cabinet id
	 */
	void startLentCabinet(Long userId, Long cabinetId);

	/**
	 * 공유사물함 대여를 합니다.
	 *
	 * @param userId    대여하려는 일반 user id
	 * @param cabinetId 대여하려는 cabinet id
	 */
	void startLentShareCabinet(Long userId, Long cabinetId, String shareCode);

	/**
	 * 동아리 사물함 대여를 합니다.
	 *
	 * @param userId    대여하려는 동아리 user id
	 * @param cabinetId 대여하려는 동아리 cabinet id
	 */
	void startLentClubCabinet(Long userId, Long cabinetId);

	/**
	 * 사물함을 반납 합니다. 유저가 정책에 따라 벤이 될 수 있습니다.
	 *
	 * @param userId 반납하려는 user id
	 */
	void endLentCabinet(Long userId);

	/**
	 * 공유사물함 대기열에서 취소합니다.
	 *
	 * @param userId - 취소하려는 user id
	 */
	void cancelLentShareCabinet(Long userId, Long cabinetId);

	/**
	 * 사물함을 강제 반납 합니다. 유저가 벤이 되진 않습니다
	 *
	 * @param userId 반납하려는 user id
	 */
	void terminateLentCabinet(Long userId);

	/**
	 * cabinet id로 사물함을 강제 반납 합니다. 유저가 벤이 되진 않습니다
	 *
	 * @param cabinetId 반납하려는 cabinet id
	 */
	void terminateLentByCabinetId(Long cabinetId);

	/**
	 * 어드민으로 유저에게 사물함을 대여 시킵니다.
	 *
	 * @param userId    대여시킬 유저 Id
	 * @param cabinetId 대여시킬 캐비넷 Id
	 */
	void assignLent(Long userId, Long cabinetId);

	/**
	 * Redis에 저장된 대여 정보를 DB에 저장하고 Redis에서 삭제합니다.
	 *
	 * @param cabinetIdString Redis에 저장된 대여 정보의 키
	 */
	void handleLentFromRedisExpired(String cabinetIdString);

	/**
	 * 현재 대여중인 모든 사물함의 대여기록을 가져옵니다.
	 *
	 * @return {@link ActiveLentHistoryDto}의 {@link List}
	 */
	List<ActiveLentHistoryDto> getAllActiveLentHistories();

	/**
	 * 현재 대여중인 사물함의 모든 대여기록을 가져온 후, expiredAt을 갱신시키고, user 의 is_extensible 을 false 한다
	 *
	 * @param userId
	 */
	void extendLentCabinet(Long userId);


}
