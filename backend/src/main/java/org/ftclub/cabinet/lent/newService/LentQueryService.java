package org.ftclub.cabinet.lent.newService;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LentQueryService {

	private final LentRepository lentRepository;

	public Page<LentHistory> findUserLentHistories(Long userId, PageRequest pageable) {
		return lentRepository.findPaginationByUserId(userId, pageable);
	}

	public List<LentHistory> findCabinetActiveLentHistory(Long cabinetId) {
		return lentRepository.findAllByCabinetIdAndEndedAtIsNull(cabinetId);
	}

	public int countUserActiveLent(Long userId) {
		return lentRepository.countByUserIdAndEndedAtIsNull(userId);
	}

	public int countCabinetUser(Long cabinetId) {
		return lentRepository.countByCabinetIdAndEndedAtIsNull(cabinetId);
	}

	public LentHistory findUserActiveLentHistoryWithLock(Long userId) {
		return lentRepository.findByUserIdAndEndedAtIsNullForUpdate(userId).orElse(null);
	}

	public List<LentHistory> findAllActiveLentHistories() {
		return lentRepository.findAllByEndedAtIsNull();
	}
}
