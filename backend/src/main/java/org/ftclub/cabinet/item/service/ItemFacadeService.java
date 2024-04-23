package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemFacadeService {

    private final ItemQueryService itemQueryService;
    private final ItemCommandService itemCommandService;
    private final ItemHistoryQueryService itemHistoryQueryService;
    private final ItemHistoryCommandService itemHistoryCommandService;

    @Transactional
    public ItemPaginationDto getItems() {
        List<Item> allItems = itemQueryService.getAllItems();
        return null;
    }

    @Transactional(readOnly = true)
    public MyItemResponseDto getMyItems(UserSessionDto user) {
        itemHistoryQueryService.getItemHistory(user.getUserId(), LocalDateTime.now(), LocalDateTime.now());
        return null;
    }

    @Transactional(readOnly = true)
    public ItemHistoryResponseDto getItemHistory(Long userId,
                                                 LocalDateTime start, LocalDateTime end) {
        return null;
    }

    @Transactional(readOnly = true)
    public CoinHistoryResponseDto getCoinHistory(Long userId, CoinHistoryType type,
                                                 LocalDateTime start, LocalDateTime end) {
        return null;
    }
}
