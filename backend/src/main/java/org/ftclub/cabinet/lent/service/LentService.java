package org.ftclub.cabinet.lent.service;

import org.ftclub.cabinet.dto.LentHistoryPaginationDto;

public interface LentService {

	void startLentCabinet(long userId, long cabinetId);

	void startLentClubCabinet(long userId, long cabinetId);

	void endLentCabinet(long userId);

	void terminateLentCabinet(long userId);

	LentHistoryPaginationDto getAllUserLentHistories(long userId, int page, int length);

	LentHistoryPaginationDto getAllCabinetLentHistories(long cabinetId, int page, int length);
}
