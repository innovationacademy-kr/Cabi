package org.ftclub.cabinet.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LentEndMemoDto {

	@JsonProperty("cabinet_memo")
	@Pattern(regexp = "\\d{4}", message = "cabinetMemo는 4글자의 숫자만 포함해야 합니다.")
	@Size(min = 4, max = 4, message = "cabinetMemo는 4글자여야 합니다.")
	private String cabinetMemo;

}
