package org.ftclub.cabinet.lent.newService;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRedis;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LentQueryService {

    private final LentRepository lentRepository;
    private final LentRedis lentRedis;

    public Page<LentHistory> findUserLentHistories(Long userId, PageRequest pageable) {
        return lentRepository.findPaginationByUserId(userId, pageable);
    }

    public LentHistory findCabinetActiveLentHistory(Long cabinetId) {
        List<LentHistory> lentHistories =
                lentRepository.findAllByCabinetIdAndEndedAtIsNull(cabinetId);
        if (lentHistories.size() >= 2) {
            throw new ServiceException(ExceptionStatus.INTERNAL_SERVER_ERROR);
        }
        if (lentHistories.isEmpty()) {
            return null;
        }
        return lentHistories.get(0);
    }
}
