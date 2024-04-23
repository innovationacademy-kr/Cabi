package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemHistoryDto {

	private LocalDateTime date;
	private ItemDto itemDto;
}
