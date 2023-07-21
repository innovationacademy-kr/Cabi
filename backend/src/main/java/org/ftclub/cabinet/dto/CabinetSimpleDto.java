package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.Location;

@AllArgsConstructor
@Getter
public class CabinetSimpleDto {
	private final Long cabinetId;
	@JsonUnwrapped
	private final Location location;
	private final Integer visibleNum;
}
