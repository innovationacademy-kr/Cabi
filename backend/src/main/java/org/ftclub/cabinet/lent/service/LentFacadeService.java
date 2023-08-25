package org.ftclub.cabinet.lent.service;

import java.util.List;
import org.ftclub.cabinet.dto.CabinetInfoRequestDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.ReturnCabinetsRequestDto;
import org.ftclub.cabinet.dto.UpdateCabinetMemoDto;
import org.ftclub.cabinet.dto.UpdateCabinetTitleDto;
import org.ftclub.cabinet.dto.UserSessionDto;

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

	/***
	 * 공유사물함 대여를 합니다.
	 *
	 * @param userId    대여하려는 일반 user id
	 * @param cabinetId  대여하려는 cabinet id
	 * @param shareCode 10분 간 유지되는 공유사물함 초대 코드
	 */
	void startLentShareCabinet(Long userId, Long cabinetId, Integer shareCode);

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
	 * @param userSessionDto 요청한 유저 dto
	 */
	void endLentCabinet(UserSessionDto userSessionDto);

	/**
	 * 사물함을 반납될 비밀번화와 함께 반납 합니다.
	 *
	 * @param userSessionDto 요청한 유저 dto
	 * @param lentEndMemoDto
	 */
	void endLentCabinetWithMemo(UserSessionDto userSessionDto, LentEndMemoDto lentEndMemoDto);

	/**
	 * 공유사물함 대여 대기열을 취소합니다.
	 * @param userId 대여하려는 일반 user id
	 */
	void cancelLentShareCabinet(Long userId);


	/**
	 * 사물함을 강제 반납 합니다. 유저가 벤이 되진 않습니다
	 *
	 * @param userId 반납하려는 user id
	 */
	void terminateLentCabinet(Long userId);

	/**
	 * 사물함들을 강제 반납 합니다. 유저가 벤이 되진 않습니다
	 *
	 * @param returnCabinetsRequestDto 반납하려는 cabinet id list
	 */
	void terminateLentCabinets(ReturnCabinetsRequestDto returnCabinetsRequestDto);

	/**
	 * 페이지네이션을 적용해서 유저가 지금까지 대여했던 모든 기록을 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @param page   페이지네이션 offset
	 * @param size   페이지네이션 size
	 * @return {@link LentHistoryPaginationDto}
	 */
	LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page, Integer size);

	/**
	 * 페이지네이션을 적용해서 지금까지 사물함의 모든 기록을 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @param page      페이지네이션 offset
	 * @param size      페이지네이션 size
	 * @return {@link LentHistoryPaginationDto}
	 */
	LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
			Integer size);

	MyCabinetResponseDto getMyLentInfo(UserSessionDto user);

	/**
	 * 아직 반납하지 않은 사물함의 대여기록을 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return {@link LentDto}의 {@link List}
	 */
	List<LentDto> getLentDtoList(Long cabinetId);

	/**
	 * 내가 대여한 기록들을 페이지네이션 기준으로 가져옵니다.
	 *
	 * @param user 유저 정보
	 * @param page 페이지
	 * @param size 사이즈
	 * @return 대여 기록
	 */
	LentHistoryPaginationDto getMyLentLog(UserSessionDto user,
			Integer page, Integer size);

	/**
	 * 자신이 대여한 사물함의 메모를 바꿉니다.
	 *
	 * @param userSessionDto       요청한 유저 dto
	 * @param updateCabinetMemoDto 변경할 사물함 제목
	 */
	void updateCabinetMemo(UserSessionDto userSessionDto,
			UpdateCabinetMemoDto updateCabinetMemoDto);

	/**
	 * 자신이 대여한 사물함의 제목을 바꿉니다.
	 *
	 * @param userSessionDto        요청한 유저 dto
	 * @param updateCabinetTitleDto 변경할 사물함 제목
	 */
	void updateCabinetTitle(UserSessionDto userSessionDto,
			UpdateCabinetTitleDto updateCabinetTitleDto);

	/**
	 * @param userSessionDto        요청한 유저 dto
	 * @param cabinetInfoRequestDto 변경할 사물함 정보 ( 제목, 메모 )
	 */
	void updateCabinetInfo(UserSessionDto userSessionDto,
			CabinetInfoRequestDto cabinetInfoRequestDto);

	/**
	 * 어드민으로 유저를 지정하여 캐비넷을 대여 시킵니다.
	 *
	 * @param userId    대여시킬 유저 Id
	 * @param cabinetId 대여시킬 캐비넷 Id
	 */
	void assignLent(Long userId, Long cabinetId);
}
