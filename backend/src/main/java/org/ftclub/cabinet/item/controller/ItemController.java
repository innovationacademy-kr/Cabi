package org.ftclub.cabinet.item.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.service.ItemFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v5/items")
@Logging
public class ItemController {

    private final ItemFacadeService itemFacadeService;

    @GetMapping("/")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public ItemPaginationDto getItems() {
        return null;
    }

    @GetMapping("/history")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public ItemHistoryResponseDto getItemHistory(@UserSession UserSessionDto user,
                                                 @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        return itemFacadeService.getItemHistory(user.getUserId(), start, end);
    }

    @GetMapping("/coin/history")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public CoinHistoryResponseDto getCoinHistory(@UserSession UserSessionDto user,
                                                 @RequestParam CoinHistoryType type,
                                                 @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        return itemFacadeService.getCoinHistory(user.getUserId(), type, start, end);
    }

    @GetMapping("/me")
    @AuthGuard(level = AuthLevel.USER_ONLY)
    public MyItemResponseDto getMyItems(@UserSession UserSessionDto user) {
        return itemFacadeService.getMyItems(user);
    }
}
