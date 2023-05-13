package org.ftclub.cabinet.lent.service;

import java.util.List;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;

/**
 * controller에서 사용하는 파사드 서비스
 */
public interface LentFacadeService {

	/**
	 * 사물함 대여를 합니다.
	 *
	 * @param userId    대여하려는 일반 user id
	 * @param cabinetId 대여하려는 cabinet id
	 */
	void startLentCabinet(Long userId, Long cabinetId);

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
	 * 사물함을 강제 반납 합니다. 유저가 벤이 되진 않습니다
	 *
	 * @param userId 반납하려는 user id
	 */
	void terminateLentCabinet(Long userId);

	/**
	 * 페이지네이션을 적용해서 유저가 지금까지 대여했던 모든 기록을 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @param page   페이지네이션 offset
	 * @param length 페이지네이션 size
	 * @return {@link LentHistoryPaginationDto}
	 */
	LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page, Integer length);

	/**
	 * 페이지네이션을 적용해서 지금까지 사물함의 모든 기록을 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @param page      페이지네이션 offset
	 * @param length    페이지네이션 size
	 * @return {@link LentHistoryPaginationDto}
	 */
	LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
			Integer length);

	/**
	 * 아직 반납하지 않은 사물함의 대여기록을 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return {@link LentDto}의 {@link List}
	 */
	List<LentDto> getLentDtoList(Long cabinetId);
}
