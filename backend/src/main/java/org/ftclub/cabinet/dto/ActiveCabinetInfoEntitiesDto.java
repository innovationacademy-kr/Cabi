package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;

@Getter
@AllArgsConstructor
@ToString
public class ActiveCabinetInfoEntitiesDto {
	private final Cabinet cabinet; // 어차피 인스턴스라 내부 변경에 대해서는 막지못하지만 트랜잭션이 readOnly면 OK
	private final LentHistory lentHistory;
	private final User user;
}
