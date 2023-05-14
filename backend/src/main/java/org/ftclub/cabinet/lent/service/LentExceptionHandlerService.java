package org.ftclub.cabinet.lent.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.service.CabinetExceptionHandlerService;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicyStatus;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.stereotype.Service;

/**
 * 대여 과정 중 생기는 {@link ServiceException}들을 처리하는 service
 */
@Service
@RequiredArgsConstructor
public class LentExceptionHandlerService {

	private final LentRepository lentRepository;
	private final CabinetExceptionHandlerService cabinetExceptionHandler;

	/**
	 * 아직 반납하지 않은 {@link LentHistory} 중에서 user id와 cabinet id에 맞는 {@link LentHistory}를 찾습니다.
	 *
	 * @param userId    찾고 싶은 user id
	 * @param cabinetId 찾고 싶은 cabinet id
	 * @return user id와 cabinet id가 맞는 반납하지 않은 {@link LentHistory}
	 * @throws ServiceException NO_LENT_CABINET
	 */
	public LentHistory getActiveLentHistoryWithUserIdAndCabinetId(Long userId, Long cabinetId) {
		LentHistory ret = getActiveLentHistoryWithUserId(userId);
		if (!ret.isCabinetIdEqual(cabinetId)) {
			throw new ServiceException(ExceptionStatus.NO_LENT_CABINET);
		}
		return ret;
	}

	/**
	 * 아직 반납하지 않은 {@link LentHistory} 중에서 cabinet id에 맞는 {@link LentHistory}를 찾습니다.
	 *
	 * @param cabinetId 찾고 싶은 cabinet id
	 * @return cabinet id가 맞는 반납하지 않은 {@link LentHistory}
	 * @throws ServiceException NO_LENT_CABINET
	 */
	public LentHistory getActiveLentHistoryWithCabinetId(Long cabinetId) {
		return lentRepository.findFirstByCabinetIdAndEndedAtIsNull(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NO_LENT_CABINET));
	}

	/**
	 * 아직 반납하지 않은 {@link LentHistory} 중에서 user id에 {@link LentHistory}를 찾습니다.
	 *
	 * @param userId 찾고 싶은 user id
	 * @return user id에 맞는 반납하지 않은 {@link LentHistory}
	 * @throws ServiceException NO_LENT_CABINET
	 */
	public LentHistory getActiveLentHistoryWithUserId(Long userId) {
		return lentRepository.findFirstByUserIdAndEndedAtIsNull(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NO_LENT_CABINET));
	}

	/**
	 * 정책에 대한 결과 상태({@link LentPolicyStatus})에 맞는 적절한 {@link ServiceException}을 throw합니다.
	 *
	 * @param status 정책에 대한 결과 상태
	 * @throws ServiceException 정책에 따라 다양한 exception이 throw될 수 있습니다.
	 */
	public void handlePolicyStatus(LentPolicyStatus status) {
		switch (status) {
			case FINE:
				break;
			case BROKEN_CABINET:
				throw new ServiceException(ExceptionStatus.LENT_BROKEN);
			case FULL_CABINET:
				throw new ServiceException(ExceptionStatus.LENT_FULL);
			case OVERDUE_CABINET:
				throw new ServiceException(ExceptionStatus.LENT_EXPIRED);
			case LENT_CLUB:
				throw new ServiceException(ExceptionStatus.LENT_CLUB);
			case IMMINENT_EXPIRATION:
				throw new ServiceException(ExceptionStatus.LENT_EXPIRE_IMMINENT);
			case ALREADY_LENT_USER:
				throw new ServiceException(ExceptionStatus.LENT_ALREADY_EXISTED);
			case PRIVATE_BANNED_USER:
				throw new ServiceException(ExceptionStatus.BAN_USER);
			case PUBLIC_BANNED_USER:
				throw new ServiceException(ExceptionStatus.PENALTY_USER);
			case BLACKHOLED_USER:
				throw new ServiceException(ExceptionStatus.BLACKHOLED_USER);
			case NOT_USER:
			case INTERNAL_ERROR:
			default:
				throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 사물함에 남은 자리가 있는 지 확인합니다. 남은 자리가 없으면 throw합니다.
	 *
	 * @param cabinetId 찾고 싶은 cabinet id
	 * @throws ServiceException LENT_FULL, NOT_FOUND_CABINET
	 */
	public void checkExistedSpace(Long cabinetId) {
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(cabinetId);
		if (lentRepository.countCabinetActiveLent(cabinetId) == cabinet.getMaxUser()) {
			throw new ServiceException(ExceptionStatus.LENT_FULL);
		}
	}
}
