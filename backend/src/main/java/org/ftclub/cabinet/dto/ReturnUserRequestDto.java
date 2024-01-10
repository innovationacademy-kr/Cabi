package org.ftclub.cabinet.dto;

import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class ReturnUserRequestDto {

	@NotNull
	private List<Long> userIds;
}
