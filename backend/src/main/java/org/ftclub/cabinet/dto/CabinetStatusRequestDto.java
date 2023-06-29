package org.ftclub.cabinet.dto;

import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;

@AllArgsConstructor
@Getter
public class CabinetStatusRequestDto {

	@NotNull
	private final List<Long> cabinetIds;
	private final LentType lentType;
	private final CabinetStatus status;
}
