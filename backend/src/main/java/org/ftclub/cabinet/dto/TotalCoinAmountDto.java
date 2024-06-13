package org.ftclub.cabinet.dto;

import lombok.Getter;

@Getter
public class TotalCoinAmountDto {

	private Long used;
	private Long unused;

	public TotalCoinAmountDto(Long used, Long unused) {
		this.used = -1 * used;
		this.unused = unused;
	}
}
