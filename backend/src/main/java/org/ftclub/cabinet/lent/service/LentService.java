package org.ftclub.cabinet.lent.service;

public interface LentService {

	void startLentCabinet(Long userId, Long cabinetId);

	void startLentClubCabinet(Long userId, Long cabinetId);

	void endLentCabinet(Long userId);

	void terminateLentCabinet(Long userId);
}
