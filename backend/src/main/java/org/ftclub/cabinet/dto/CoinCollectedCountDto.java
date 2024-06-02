package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class CoinCollectedCountDto {

	private Integer coinCount;
	private Integer userCount;
}
