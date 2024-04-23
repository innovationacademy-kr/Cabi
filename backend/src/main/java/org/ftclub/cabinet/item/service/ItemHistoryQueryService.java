package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;

@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemHistoryQueryService {

	private final ItemHistoryRepository itemHistoryRepository;
}
