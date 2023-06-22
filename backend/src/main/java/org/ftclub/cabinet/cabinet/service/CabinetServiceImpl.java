package org.ftclub.cabinet.cabinet.service;

import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
@Log4j2
public class CabinetServiceImpl implements CabinetService {

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
		log.info("Called updateStatus: {}, {}", cabinetId, status);
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
		log.info("Called updateMemo: {}, {}", cabinetId, memo);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeMemo(memo);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateVisibleNum(Long cabinetId, Integer visibleNum) {
		log.info("Called updateVisibleNum: {}, {}", cabinetId, visibleNum);
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
		log.info("Called updateTitle: {}, {}", cabinetId, title);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeTitle(title);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateMaxUser(Long cabinetId, Integer maxUser) {
		log.info("Called updateMaxUser: {}, {}", cabinetId, maxUser);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyMaxUser(maxUser);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateLentType(Long cabinetId, LentType lentType) {
		log.info("Called updateLentType: {}, {}", cabinetId, lentType);
		if (!lentType.isValid()) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyLentType(lentType);
		if (lentType == LentType.SHARE) {
			cabinet.specifyMaxUser(3);
		} else if (lentType == LentType.PRIVATE) {
			cabinet.specifyMaxUser(1);
		}
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateGrid(Long cabinetId, Grid grid) {
		log.info("Called updateGrid: {}, {}", cabinetId, grid);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.coordinateGrid(grid);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateStatusNote(Long cabinetId, String statusNote) {
		log.info("Called updateStatusNote: {}, {}", cabinetId, statusNote);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeStatusNote(statusNote);
	}
}
