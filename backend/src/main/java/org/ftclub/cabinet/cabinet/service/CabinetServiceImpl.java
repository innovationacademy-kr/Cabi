package org.ftclub.cabinet.cabinet.service;

import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CabinetServiceImpl implements CabinetService {

	private final CabinetExceptionHandlerService cabinetExceptionHandlerService;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public Cabinet getCabinet(Long cabinetId) {
		return cabinetExceptionHandlerService.getCabinet(cabinetId);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateStatus(Long cabinetId, CabinetStatus status) {
		if (!status.isValid()) {
			throw new IllegalArgumentException("Invalid status");
		}
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.specifyStatus(status);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateStatusByUserCount(Long cabinetId, Integer userCount) {
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		if (!cabinet.isStatusUpdatableByUserCount(userCount)) {
			throw new ServiceException(ExceptionStatus.UNCHANGEABLE_CABINET);
		}
		cabinet.specifyStatusByUserCount(userCount);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateMemo(Long cabinetId, String memo) {
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.writeMemo(memo);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateVisibleNum(Long cabinetId, Integer visibleNum) {
		if (visibleNum < 0) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.assignVisibleNum(visibleNum);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateTitle(Long cabinetId, String title) {
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.writeTitle(title);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateMaxUser(Long cabinetId, Integer maxUser) {
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.specifyMaxUser(maxUser);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateLentType(Long cabinetId, LentType lentType) {
		if (!lentType.isValid()) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.specifyLentType(lentType);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateGrid(Long cabinetId, Grid grid) {
		if (!grid.isValid()) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.coordinateGrid(grid);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateStatusNote(Long cabinetId, String statusNote) {
		Cabinet cabinet = cabinetExceptionHandlerService.getCabinet(cabinetId);
		cabinet.writeStatusNote(statusNote);
	}
}
