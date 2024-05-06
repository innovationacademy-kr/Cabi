package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class CoinHistoryDto {

	private LocalDateTime date;
	private Integer amount;
	private String history;
	private String itemDetails;
}
