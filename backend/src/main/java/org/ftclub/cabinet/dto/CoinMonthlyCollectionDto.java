package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class CoinMonthlyCollectionDto {

	private Long monthlyCoinCount;
	private boolean todayCoinCollection;
}
