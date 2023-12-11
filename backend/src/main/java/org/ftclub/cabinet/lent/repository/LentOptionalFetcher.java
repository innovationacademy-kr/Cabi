package org.ftclub.cabinet.lent.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
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
	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final LentRedis lentRedis;

	public List<LentHistory> findAllActiveLentByCabinetId(Long cabinetId) {
		log.debug("Called findAllActiveLentByCabinetId: {}", cabinetId);
		return lentRepository.findAllByCabinetIdAndEndedAtIsNull(cabinetId);
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
	 * 유저 id 로 대여 기록을 확인합니다. 없을경우, 빈 List 를 리턴합니다. 반납하지 않은 기록은 조회하지 않습니다.
	 *
	 * @param userId
	 * @param pageable
	 * @return
	 */
	public List<LentHistory> findAllByUserIdAndEndedAtNotNull(Long userId, Pageable pageable) {
		log.debug("Called findByUserId: {}", userId);
		return lentRepository.findPaginationByUserIdAndEndedAtNotNull(userId, pageable).toList();
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
		return lentRepository.findByUserIdAndEndedAtIsNullForUpdate(userId)
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
		Cabinet cabinet = cabinetOptionalFetcher.getCabinet(cabinetId);
		if (lentRepository.countByCabinetIdAndEndedAtIsNull(cabinetId) == cabinet.getMaxUser()) {
			throw new ServiceException(ExceptionStatus.LENT_FULL);
		}
	}


	/**
	 * @param userId 유저 id
	 * @return 유저가 대여한 총 횟수
	 */

	public int countUserAllLent(Long userId) {
		log.debug("Called countUserAllLent: {}", userId);
		return lentRepository.countByUserId(userId);
	}

	/**
	 * @param cabinetId 캐비넷 id
	 * @return 캐비넷을 현재 대여 중인 기록(공유 사물함의 경우를 포함하여 리스트로 반환)
	 */
	public List<LentHistory> findAllActiveLentHistoriesByCabinetId(Long cabinetId) {
		log.debug("Called findByCabinetId: {}", cabinetId);
		return lentRepository.findAllByCabinetIdAndEndedAtIsNull(cabinetId);
	}

	public List<LentHistory> findAllActiveLentHistories() {
		log.debug("Called findAllActiveLentHistories");
		return lentRepository.findAllByEndedAtIsNull();
	}

	/**
	 * @param userId 유저 id
	 * @return 유저가 대여중인 캐비넷
	 */
	public Cabinet findActiveLentCabinetByUserId(Long userId) {
		log.debug("Called findActiveLentCabinetByUserId: {}", userId);
		return cabinetRepository.findByUserIdAndEndedAtIsNull(userId).orElse(null);
	}

	/**
	 * Redis에서 유저가 대여대기중인 캐비넷을 가져옵니다.
	 *
	 * @param userId
	 * @return 유저가 대여대기중인 cabinet Id
	 */
	public Long findCabinetIdByUserIdFromRedis(Long userId) {
		log.debug("Called findActiveLentCabinetByUserIdFromRedis: {}", userId);
		return lentRedis.findCabinetIdByUserIdInRedis(userId);
	}

	/**
	 * Redis에서 캐비넷을 대여대기중인 유저들의 user Ids를 가져옵니다.
	 *
	 * @param cabinetId 캐비넷 id
	 * @return 해당 캐비넷을 대여대기중인 유저들의 user Ids
	 */
	public List<String> findUserIdsByCabinetIdFromRedis(Long cabinetId) {
		log.debug("Called findActiveLentUserIdsByCabinetId: {}", cabinetId);
		return lentRedis.getUserIdsByCabinetIdInRedis(cabinetId.toString());
	}

	public List<LentHistory> findAllOverdueLent(LocalDateTime date, Pageable pageable) {
		log.debug("Called findAllOverdueLent: {}", date);
		return lentRepository.findAllExpiredAtBeforeAndEndedAtIsNull(date, pageable);
	}

	/**
	 * 아직 반납하지 않은 {@link LentHistory} 중에서 user id를 통해 {@link LentHistory}를 찾습니다. CABINET JOIN 없이,
	 * LentHistory의 subquery를 통해 찾습니다.
	 *
	 * @param userId 찾고 싶은 LentHistory 의 user id
	 * @return user id에 맞는 반납하지 않은 {@link LentHistory}
	 */
	public List<LentHistory> findAllActiveLentHistoriesByUserId(Long userId) {
		log.debug("Called findAllActiveLentHistoriesByUserId: {}", userId);
		return lentRepository.findAllActiveLentHistoriesByUserId(userId);
	}

	public List<LentHistory> findPreviousLentHistoryByCabinetId(Long cabinetId) {
		log.debug("Called findPreviousLentUserNameByCabinetId: {}", cabinetId);
		return lentRepository.findByCabinetIdAndEndedAtIsNotNullOrderByEndedAtDesc(cabinetId);
	}

	public List<LentHistory> findAllByCabinetIdsAfterDate(LocalDate date, List<Long> cabinetIds) {
		return lentRepository.findAllByCabinetIdsAfterDate(date, cabinetIds);
	}
}
