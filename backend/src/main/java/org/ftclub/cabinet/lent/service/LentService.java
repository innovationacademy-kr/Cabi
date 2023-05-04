package org.ftclub.cabinet.lent.service;

import org.ftclub.cabinet.dto.LentHistoryPaginationDto;

public interface LentService {

	void startLentCabinet(Long userId, Long cabinetId);

	void startLentClubCabinet(Long userId, Long cabinetId);

	void endLentCabinet(Long userId);

	void terminateLentCabinet(Long userId);

	LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page, Integer length);

	LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
			Integer length);
}
