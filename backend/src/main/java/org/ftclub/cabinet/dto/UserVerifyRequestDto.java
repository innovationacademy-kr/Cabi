package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.user.domain.BanHistory;

@Getter
@AllArgsConstructor
public class UserVerifyRequestDto {

	//	private UserRole userRole;
	private LocalDateTime blackholedAt;
	private int lentCount;
	private Long cabinetId;
	private CabinetStatus cabinetStatus;
	private List<BanHistory> banHistories;
}
