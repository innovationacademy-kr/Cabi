package org.ftclub.cabinet.dto;

import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class CabinetStatusRequestDto {

	@NotNull
	private List<Long> cabinetIds;
	private LentType lentType;
	private CabinetStatus status;
}
