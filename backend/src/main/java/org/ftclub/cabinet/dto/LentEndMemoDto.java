package org.ftclub.cabinet.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Getter
@ToString
public class LentEndMemoDto {

	//	@JsonProperty("cabinetMemo") <- 얘 넣으면 작동 안 함
	@Pattern(regexp = "\\d{4}", message = "cabinetMemo는 4글자의 숫자만 포함해야 합니다.")
	@Size(min = 4, max = 4, message = "cabinetMemo는 4글자여야 합니다.")
	private String cabinetMemo;

}
