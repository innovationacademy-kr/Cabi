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

@Service
@RequiredArgsConstructor
public class LentExceptionHandlerService {

	private final LentRepository lentRepository;
	private final CabinetExceptionHandlerService cabinetExceptionHandler;

	public LentHistory getActiveLentHistoryWithUserIdAndCabinetId(Long userId, Long cabinetId) {
		LentHistory ret = getActiveLentHistoryWithUserId(userId);
		if (!ret.isCabinetIdEqual(cabinetId)) {
			throw new ServiceException(ExceptionStatus.NO_LENT_CABINET);
		}
		return ret;
	}

	public LentHistory getActiveLentHistoryWithCabinetId(Long cabinetId) {
		return lentRepository.findFirstByCabinetIdAndEndedAtIsNull(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NO_LENT_CABINET));
	}

	public LentHistory getActiveLentHistoryWithUserId(Long userId) {
		return lentRepository.findFirstByUserIdAndEndedAtIsNull(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NO_LENT_CABINET));
	}

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
				throw new ServiceException(ExceptionStatus.PRIVATE_BANNED_USER);
			case PUBLIC_BANNED_USER:
				throw new ServiceException(ExceptionStatus.PUBLIC_BANNED_USER);
			case BLACKHOLED_USER:
				throw new ServiceException(ExceptionStatus.BLACKHOLED_USER);
			default:
				throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void checkExistedSpace(Long cabinetId) {
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(cabinetId);
		if (lentRepository.countCabinetActiveLent(cabinetId) == cabinet.getMaxUser()) {
			throw new ServiceException(ExceptionStatus.LENT_FULL);
		}
	}
}
