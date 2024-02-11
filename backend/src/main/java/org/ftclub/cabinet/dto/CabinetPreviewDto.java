package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class CabinetPreviewDto {

	private Long cabinetId;
	private Integer visibleNum;
	private String title;
	private LentType lentType;
	private Integer maxUser;
	private CabinetStatus status;
	private Integer userCount;
	private String name;
}
