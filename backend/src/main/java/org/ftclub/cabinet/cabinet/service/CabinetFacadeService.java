package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetClubStatusRequestDto;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetSimplePaginationDto;
import org.ftclub.cabinet.dto.CabinetStatusRequestDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.*;

import java.util.List;

public interface CabinetFacadeService {

	/**
	 * 모든 건물의 층 정보를 반환합니다.
	 *
	 * @return 건물별 건물을 포함한 그 건물의 전체 층 리스트
	 */
	List<BuildingFloorsDto> getBuildingFloorsResponse();

	/**
	 * 특정 사물함의 정보와 그 사물함의 대여 정보들을 반환합니다.
	 *
	 * @param cabinetId 캐비넷 ID
	 * @return 캐비넷 정보
	 */
	CabinetInfoResponseDto getCabinetInfo(Long cabinetId);

	CabinetInfoPaginationDto getCabinetsInfo(Integer visibleNum);

	/**
	 * 특정 사물함의 층 - 번호정보를 반환합니다.
	 *
	 * @param visibleNum 표시 번호
	 * @return 캐비넷 정보
	 */
	CabinetSimplePaginationDto getCabinetsSimpleInfoByVisibleNum(Integer visibleNum);

	/**
	 * 건물의 층별 각 구역들에 있는 사물함들의 정보를 반환합니다.
	 *
	 * @param building 건물 이름
	 * @param floor    층
	 * @return 구역에 따른 사물함 정보 리스트
	 */
	List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building, Integer floor);

	/**
	 * 사물함의 상태 메모를 업데이트합니다.
	 *
	 * @param cabinetId  사물함 ID
	 * @param statusNote 상태 메모
	 */
	void updateCabinetStatusNote(Long cabinetId, String statusNote);

	/**
	 * 사물함의 제목을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param title     변경할 제목
	 */
	void updateCabinetTitle(Long cabinetId, String title);

	/**
	 * 사물함의 행과 열을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param row       변경할 행
	 * @param col       변경할 열
	 */
	void updateCabinetGrid(Long cabinetId, Integer row, Integer col);

	/**
	 * 사물함의 표시 번호를 업데이트합니다.
	 *
	 * @param cabinetId  사물함 ID
	 * @param visibleNum 변경할 표시 번호
	 */
	void updateCabinetVisibleNum(Long cabinetId, Integer visibleNum);

	/**
	 * 사물함의 상태를 업데이트합니다.
	 *
	 * @param cabinetStatusRequestDto 사물함 ID 리스트 dto
	 */
	void updateCabinetBundleStatus(CabinetStatusRequestDto cabinetStatusRequestDto);

//	/**
//	 * 사물함의 대여 타입을 업데이트합니다.
//	 *
//	 * @param cabinetIds 사물함 ID 리스트
//	 * @param lentType   변경할 대여 타입
//	 */
//	void updateCabinetBundleLentType(List<Long> cabinetIds, LentType lentType);


	/**
	 * 대여 타입에 따른 사물함 페이지네이션을 가져옵니다.
	 *
	 * @param lentType 대여 타입
	 * @param pageable 페이지네이션(page, size)
	 * @return 사물함 페이지네이션
	 */
	CabinetPaginationDto getCabinetPaginationByLentType(LentType lentType, Integer page,
	                                                    Integer size);

	/**
	 * 사물함 상태에 따른 사물함 페이지네이션을 가져옵니다.
	 *
	 * @param status   사물함 상태
	 * @param pageable 페이지네이션(page, size)
	 * @return 사물함 페이지네이션
	 */
	CabinetPaginationDto getCabinetPaginationByStatus(CabinetStatus status, Integer page,
			Integer size);

	/**
	 * 사물함 표시 번호에 따른 사물함 페이지네이션을 가져옵니다.
	 *
	 * @param visibleNum 사물함 표시 번호
	 * @param pageable   페이지네이션(page, size)
	 * @return 사물함 페이지네이션
	 */
	CabinetPaginationDto getCabinetPaginationByVisibleNum(Integer visibleNum, Integer page,
	                                                      Integer size);

	/**
	 * 사물함 Id에 따른 대여 기록 페이지네이션을 가져옵니다.
	 *
	 * @param cabinetId 사물함 Id
	 * @param pageable  페이지네이션(page, size)
	 * @return 대여 기록 페이지네이션
	 */
	LentHistoryPaginationDto getCabinetLentHistoriesPagination(Long cabinetId,
			Integer page,
			Integer size);

	/**
	 * 사물함에 동아
	 *
	 * @param clubStatusRequestDto
	 */
	void updateCabinetClubStatus(CabinetClubStatusRequestDto clubStatusRequestDto);
	                                                           Integer page,
	                                                           Integer size);
}
