package org.ftclub.cabinet.lent.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class PaginationRequestDto {

	private final Integer page;
	private final Integer length;
}
