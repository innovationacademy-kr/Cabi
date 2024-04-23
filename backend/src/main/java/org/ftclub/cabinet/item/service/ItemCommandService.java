package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.ItemCreateDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.repository.ItemRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemCommandService {

	private final ItemRepository itemRepository;

	public void createItem(ItemCreateDto dto) {
		itemRepository.save(
				Item.of(dto.getName(), dto.getPrice(), dto.getSku(), dto.getDescription(),
						dto.getType()));
	}

}
