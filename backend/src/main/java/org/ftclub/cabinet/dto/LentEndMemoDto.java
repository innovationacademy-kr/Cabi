package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LentEndMemoDto {

	@JsonProperty("cabinet_memo")
	private String cabinetMemo;

}
