package org.ftclub.cabinet.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AdminCabinetGridUpdateRequestDto {
	private int row;
	private int col;
}
