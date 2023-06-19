package org.ftclub.cabinet.cabinet.service;

import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CabinetServiceImpl implements CabinetService {
	private static final Logger logger = LogManager.getLogger(CabinetService.class);
	private final CabinetOptionalFetcher cabinetOptionalFetcher;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public Cabinet getCabinet(Long cabinetId) {
		return cabinetOptionalFetcher.getCabinet(cabinetId);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public Cabinet getLentCabinetByUserId(Long userId) {
		return cabinetOptionalFetcher.getLentCabinetByUserId(userId);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateStatus(Long cabinetId, CabinetStatus status) {
		logger.info("Called updateStatus: {}, {}", cabinetId, status);
		if (!status.isValid()) {
			throw new IllegalArgumentException("Invalid status");
		}
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyStatus(status);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateMemo(Long cabinetId, String memo) {
		logger.info("Called updateMemo: {}, {}", cabinetId, memo);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeMemo(memo);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateVisibleNum(Long cabinetId, Integer visibleNum) {
		logger.info("Called updateVisibleNum: {}, {}", cabinetId, visibleNum);
		if (visibleNum < 0) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.assignVisibleNum(visibleNum);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateTitle(Long cabinetId, String title) {
		logger.info("Called updateTitle: {}, {}", cabinetId, title);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeTitle(title);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateMaxUser(Long cabinetId, Integer maxUser) {
		logger.info("Called updateMaxUser: {}, {}", cabinetId, maxUser);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyMaxUser(maxUser);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateLentType(Long cabinetId, LentType lentType) {
		logger.info("Called updateLentType: {}, {}", cabinetId, lentType);
		if (!lentType.isValid()) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyLentType(lentType);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateGrid(Long cabinetId, Grid grid) {
		logger.info("Called updateGrid: {}, {}", cabinetId, grid);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.coordinateGrid(grid);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateStatusNote(Long cabinetId, String statusNote) {
		logger.info("Called updateStatusNote: {}, {}", cabinetId, statusNote);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeStatusNote(statusNote);
	}
}
