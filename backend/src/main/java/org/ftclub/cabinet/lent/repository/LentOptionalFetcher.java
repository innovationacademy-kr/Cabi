package org.ftclub.cabinet.lent.repository;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.redis.TicketingSharedCabinet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 대여 과정 중 생기는 {@link ServiceException}들을 처리하는 service
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class LentOptionalFetcher {

	private final LentRepository lentRepository;

	private final CabinetRepository cabinetRepository;
	private final CabinetOptionalFetcher cabinetExceptionHandler;
	private final TicketingSharedCabinet ticketingSharedCabinet;

	public List<LentHistory> findAllActiveLentByCabinetId(Long cabinetId) {
		log.debug("Called findAllActiveLentByCabinetId: {}", cabinetId);
		return lentRepository.findAllActiveLentByCabinetId(cabinetId);
	}

	public List<LentHistory> findActiveLentByCabinetIdWithUser(Long cabinetId) {
		log.info("Called findActiveLentByCabinetIdWithUser: {}", cabinetId);
		return lentRepository.findActiveLentHistoriesByCabinetIdWithUser(cabinetId);
	}

	public Page<LentHistory> findPaginationByCabinetId(Long cabinetId, PageRequest pageable) {
		log.debug("Called findPaginationByCabinetId: {}", cabinetId);
		return lentRepository.findPaginationByCabinetId(cabinetId, pageable);
	}

	public Page<LentHistory> findPaginationByUserId(Long userId, PageRequest pageable) {
		log.debug("Called findPaginationByUserId: {}", userId);
		return lentRepository.findPaginationByUserId(userId, pageable);
	}

	/**
	 * 아직 반납하지 않은 {@link LentHistory} 중에서 user id와 cabinet id에 맞는 {@link LentHistory}를 찾습니다.
	 *
	 * @param userId    찾고 싶은 user id
	 * @param cabinetId 찾고 싶은 cabinet id
	 * @return user id와 cabinet id가 맞는 반납하지 않은 {@link LentHistory}
	 * @throws ServiceException NO_LENT_CABINET
	 */
	public LentHistory getActiveLentHistoryWithUserIdAndCabinetId(Long userId, Long cabinetId) {
		log.debug("Called getActiveLentHistoryWithUserIdAndCabinetId: {}, {}", userId, cabinetId);
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
		log.debug("Called getActiveLentHistoryWithCabinetId: {}", cabinetId);
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
		log.debug("Called getActiveLentHistoryWithUserId: {}", userId);
		return lentRepository.findFirstByUserIdAndEndedAtIsNull(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NO_LENT_CABINET));
	}

	/**
	 * 아직 반납하지 않은 {@link LentHistory} 중에서 user id에 {@link LentHistory}를 찾습니다.
	 *
	 * @param userId 찾고 싶은 user id
	 * @return user id에 맞는 반납하지 않은 {@link LentHistory}
	 * @throws ServiceException NO_LENT_CABINET
	 * @Lock
	 */
	public LentHistory getActiveLentHistoryWithUserIdForUpdate(Long userId) {
		log.debug("Called getActiveLentHistoryWithUserId: {}", userId);
		return lentRepository.findFirstByUserIdAndEndedAtIsNullForUpdate(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NO_LENT_CABINET));
	}


	/**
	 * 사물함에 남은 자리가 있는 지 확인합니다. 남은 자리가 없으면 throw합니다.
	 *
	 * @param cabinetId 찾고 싶은 cabinet id
	 * @throws ServiceException LENT_FULL, NOT_FOUND_CABINET
	 */
	public void checkExistedSpace(Long cabinetId) {
		log.debug("Called checkExistedSpace: {}", cabinetId);
		Cabinet cabinet = cabinetExceptionHandler.getCabinet(cabinetId);
		if (lentRepository.countCabinetActiveLent(cabinetId) == cabinet.getMaxUser()) {
			throw new ServiceException(ExceptionStatus.LENT_FULL);
		}
	}

	/**
	 * 유저 id 로 대여 기록을 확인합니다. 없을경우, 빈 List 를 리턴합니다.
	 *
	 * @param userId   유저Id
	 * @param pageable
	 * @return
	 */
	public List<LentHistory> findByUserId(Long userId, Pageable pageable) {
		log.debug("Called findByUserId: {}", userId);
		return lentRepository.findByUserId(userId, pageable);
	}

	/**
	 * 유저 id 로 대여 기록을 확인합니다. 없을경우, 빈 List 를 리턴합니다. 반납하지 않은 기록은 조회하지 않습니다.
	 *
	 * @param userId
	 * @param pageable
	 * @return
	 */

	public List<LentHistory> findByUserIdAndEndedAtNotNull(Long userId, Pageable pageable) {
		log.debug("Called findByUserId: {}", userId);
		return lentRepository.findByUserIdAndEndedAtNotNull(userId, pageable);
	}


	/**
	 * @param userId 유저 id
	 * @return 유저가 대여한 총 횟수
	 */

	public int countUserAllLent(Long userId) {
		log.debug("Called countUserAllLent: {}", userId);
		return lentRepository.countUserAllLent(userId);
	}

	/**
	 * @param cabinetId 캐비넷 id
	 * @param pageable
	 * @return 캐비넷이 대여된 기록
	 */
	public List<LentHistory> findByCabinetId(Long cabinetId, Pageable pageable) {
		log.debug("Called findByCabinetId: {}", cabinetId);
		return lentRepository.findByCabinetId(cabinetId, pageable);
	}

	/**
	 * @param cabinetId 캐비넷 id
	 * @return 캐비넷이 대여된 총 횟수
	 */
	public int countCabinetAllLent(Long cabinetId) {
		log.debug("Called countCabinetAllLent: {}", cabinetId);
		return lentRepository.countCabinetAllLent(cabinetId);
	}

	public List<LentHistory> findAllActiveLentHistories() {
		log.debug("Called findAllActiveLentHistories");
		return lentRepository.findAllActiveLentHistories();
	}

	/**
	 * @param userId 유저 id
	 * @return 유저가 대여중인 캐비넷
	 */
	public Cabinet findActiveLentCabinetByUserId(Long userId) {
		log.debug("Called findActiveLentCabinetByUserId: {}", userId);
		return cabinetRepository.findLentCabinetByUserId(userId).orElse(null);
	}

	/**
	 * Redis에서 유저가 대여대기중인 캐비넷을 가져옵니다.
	 *
	 * @param userId
	 * @return 유저가 대여대기중인 cabinet Id
	 */
	public Long findCabinetIdByUserIdFromRedis(Long userId) {
		log.debug("Called findActiveLentCabinetByUserIdFromRedis: {}", userId);
		return ticketingSharedCabinet.findCabinetIdByUserId(userId);
	}

	/**
	 * Redis에서 캐비넷을 대여대기중인 유저들의 user Ids를 가져옵니다.
	 *
	 * @param cabinetId 캐비넷 id
	 * @return 해당 캐비넷을 대여대기중인 유저들의 user Ids
	 */
	public List<String> findUserIdsByCabinetIdFromRedis(Long cabinetId) {
		log.debug("Called findActiveLentUserIdsByCabinetId: {}", cabinetId);
		return ticketingSharedCabinet.getUserIdsByCabinetId(cabinetId.toString());
	}

	public List<LentHistory> findAllOverdueLent(LocalDateTime date, Pageable pageable) {
		log.debug("Called findAllOverdueLent: {}", date);
		return lentRepository.findAllOverdueLent(date, pageable);
	}

	public Integer countCabinetAllActiveLent(Long cabinetId) {
		log.debug("Called countCabinetAllActiveLent: {}", cabinetId);
		return lentRepository.countCabinetAllActiveLent(cabinetId);
	}

	public LocalDateTime getSessionExpiredAtFromRedis(Long cabinetId) {
		log.debug("Called getSessionExpiredAtFromRedis: {}", cabinetId);
		return ticketingSharedCabinet.getSessionExpiredAt(cabinetId);
	}

	/**
	 * 아직 반납하지 않은 {@link LentHistory} 중에서 user id를 통해 {@link LentHistory}를 찾습니다.
	 *
	 * @param userId 찾고 싶은 LentHistory 의 user id
	 * @return user id에 맞는 반납하지 않은 {@link LentHistory}
	 */
	public List<LentHistory> findAllActiveLentHistoriesByUserId(Long userId) {
		log.debug("Called findAllActiveLentHistoriesByUserId: {}", userId);
		return lentRepository.findAllActiveLentHistoriesByUserId(userId);
	}
}
