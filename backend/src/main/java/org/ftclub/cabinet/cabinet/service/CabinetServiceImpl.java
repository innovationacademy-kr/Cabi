package org.ftclub.cabinet.cabinet.service;

import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class CabinetServiceImpl implements CabinetService {

	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final UserOptionalFetcher userOptionalFetcher;
	private final LentOptionalFetcher lentOptionalFetcher;
	private final CabinetProperties cabinetProperties;

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
		log.debug("Called updateStatus: {}, {}", cabinetId, status);
		if (!status.isValid()) {
			throw new ServiceException(ExceptionStatus.INVALID_STATUS);
		}
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyStatus(status);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateMemo(Long cabinetId, String memo) {
		log.debug("Called updateMemo: {}, {}", cabinetId, memo);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeMemo(memo);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateVisibleNum(Long cabinetId, Integer visibleNum) {
		log.debug("Called updateVisibleNum: {}, {}", cabinetId, visibleNum);
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
		log.debug("Called updateTitle: {}, {}", cabinetId, title);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeTitle(title);
	}

	@Override
	public void updateTitleAndMemo(Long cabinetId, String title, String memo) {
		log.debug("Called updateTitleAndMemo: {}, {}, {}", cabinetId, title, memo);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		if (StringUtils.hasText(title)) {
			cabinet.writeTitle(title);
		}
		if (StringUtils.hasText(memo)) {
			cabinet.writeMemo(memo);
		}
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateMaxUser(Long cabinetId, Integer maxUser) {
		log.debug("Called updateMaxUser: {}, {}", cabinetId, maxUser);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyMaxUser(maxUser);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateLentType(Long cabinetId, LentType lentType) {
		log.debug("Called updateLentType: {}, {}", cabinetId, lentType);
		if (!lentType.isValid()) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.specifyLentType(lentType);
		if (lentType == LentType.SHARE) {
			cabinet.specifyMaxUser(Math.toIntExact(
					cabinetProperties.getShareMaxUserCount()));
		} else { // club 도 1명으로 변경
			cabinet.specifyMaxUser(1);
		}
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateGrid(Long cabinetId, Grid grid) {
		log.debug("Called updateGrid: {}, {}", cabinetId, grid);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.coordinateGrid(grid);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateStatusNote(Long cabinetId, String statusNote) {
		log.debug("Called updateStatusNote: {}, {}", cabinetId, statusNote);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		cabinet.writeStatusNote(statusNote);
	}

	@Override
	public void updateClub(Long cabinetId, Long userId, String statusNote) {
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(cabinetId);
		String clubName = "";
		if (userId != null) {
			clubName = userOptionalFetcher.getClubUser(userId).getName();
		}
		Cabinet lentCabinet = lentOptionalFetcher.findActiveLentCabinetByUserId(userId);
		if (lentCabinet != null) {
			throw new ServiceException(ExceptionStatus.LENT_ALREADY_EXISTED);
		}
		cabinet.writeTitle(clubName);
		cabinet.writeStatusNote(statusNote);
		cabinet.specifyLentType(LentType.CLUB);
	}

//	@Override
//	public List<Long> getPendingCabinets() {
//		return cabinetOptionalFetcher.findPendingCabinets();
//	}
}
