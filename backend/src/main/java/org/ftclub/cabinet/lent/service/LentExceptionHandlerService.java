package org.ftclub.cabinet.lent.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicyStatus;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LentExceptionHandlerService {

	private final LentRepository lentRepository;
	private final CabinetRepository cabinetRepository;
	private final UserRepository userRepository;

	public Cabinet getCabinet(Long cabinetId) {
		return cabinetRepository.findById(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet getClubCabinet(Long cabinetId) {
		Cabinet cabinet = getCabinet(cabinetId);
        if (!cabinet.isLentType(LentType.CLUB)) {
            throw new ServiceException(ExceptionStatus.NOT_FOUND_CABINET);
        }
		return cabinet;
	}

	public User getUser(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
	}

	public User getClubUser(Long userId) {
		User user = getUser(userId);
        if (!user.isUserRole(UserRole.CLUB)) {
            throw new ServiceException(ExceptionStatus.NOT_FOUND_USER);
        }
		return user;
	}

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
			default:
				throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void checkExistedSpace(Long cabinetId) {
		Cabinet cabinet = getCabinet(cabinetId);
		if (lentRepository.countCabinetActiveLent(cabinetId) == cabinet.getMaxUser())
			throw new ServiceException(ExceptionStatus.LENT_FULL);
	}
}
