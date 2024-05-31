package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CoinStaticsDto {

	private List<CoinAmountDto> issuedCoin;
	private List<CoinAmountDto> usedCoin;
}
