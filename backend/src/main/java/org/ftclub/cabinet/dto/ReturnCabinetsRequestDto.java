package org.ftclub.cabinet.dto;

import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Getter
@ToString
public class ReturnCabinetsRequestDto {

	@NotNull
	private List<Long> cabinetIds;
}
