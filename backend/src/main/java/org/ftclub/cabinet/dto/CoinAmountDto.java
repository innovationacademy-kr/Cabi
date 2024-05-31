package org.ftclub.cabinet.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CoinAmountDto {

	private LocalDate date;
	private Long amount;
}
