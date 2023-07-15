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
public class ActiveCabinetInfoEntities {
	private final Cabinet cabinet;
	private final LentHistory lentHistory;
	private final User user;
}