package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class BanHistoryQueryService {

    private final BanHistoryRepository banHistoryRepository;

    public BanHistory findRecentActiveBanHistory(Long userId, LocalDateTime now) {
        log.debug("Called findRecentActiveBanHistory: {}", userId);

        List<BanHistory> banHistories = banHistoryRepository.findAll();

    }

}
