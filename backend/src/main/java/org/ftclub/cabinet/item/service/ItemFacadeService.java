package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemFacadeService {
    private final ItemQueryService itemQueryService;
    private final ItemCommandService itemCommandService;

    @Transactional(readOnly = true)
    public void getMyItems(UserSessionDto user) {

    }
}
