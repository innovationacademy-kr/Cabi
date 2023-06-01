package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.springframework.data.domain.PageRequest;

public interface CabinetService {

	/**
	 * 사물함 ID로 사물함 Entity를 가져옵니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @return 사물함 엔티티
	 */
	Cabinet getCabinet(Long cabinetId);

	/**
	 * 사물함의 상태를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param status    변경할 상태
	 */
	void updateStatus(Long cabinetId, CabinetStatus status);

	/**
	 * 대여 시작/종료 이후의 사용자 수에 따라 사물함의 상태를 변경합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param userCount 사용자 수
	 */
	void updateStatusByUserCount(Long cabinetId, Integer userCount);

	/**
	 * 사물함의 메모를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param memo      변경할 메모
	 */
	void updateMemo(Long cabinetId, String memo);

	/**
	 * 사물함의 표시 번호를 업데이트합니다.
	 *
	 * @param cabinetId  사물함 ID
	 * @param visibleNum 변경할 표시 번호
	 */
	void updateVisibleNum(Long cabinetId, Integer visibleNum);

	/**
	 * 사물함의 제목을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param title     변경할 제목
	 */
	void updateTitle(Long cabinetId, String title);

	/**
	 * 사물함의 최대 사용자 수를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param maxUser   변경할 최대 사용자 수
	 */
	void updateMaxUser(Long cabinetId, Integer maxUser);

	/**
	 * 사물함의 대여 유형을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param lentType  변경할 대여 유형
	 */
	void updateLentType(Long cabinetId, LentType lentType);

	/**
	 * 사물함의 그리드(행, 열)를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param grid      변경할 그리드
	 */
	void updateGrid(Long cabinetId, Grid grid);

	/**
	 * 사물함의 상태 메모를 업데이트합니다.
	 *
	 * @param cabinetId  사물함 ID
	 * @param statusNote 변경할 상태 메모
	 */
	void updateStatusNote(Long cabinetId, String statusNote);

	List<Cabinet> getCabinetListByLentType(LentType lentType, PageRequest pageable);

	List<Cabinet> getCabinetListByStatus(CabinetStatus status, PageRequest pageable);

	List<Cabinet> getCabinetListByVisibleNum(Integer visibleNum, PageRequest pageable);
}
