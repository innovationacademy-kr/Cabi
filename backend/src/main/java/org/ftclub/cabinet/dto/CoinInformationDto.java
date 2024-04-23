package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CoinInformationDto {

	private Long monthlyCoinCount;
	private boolean todayCoinCollection;
}
