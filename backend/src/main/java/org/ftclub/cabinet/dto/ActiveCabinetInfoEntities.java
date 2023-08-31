package org.ftclub.cabinet.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;

@Getter
@ToString
public class ActiveCabinetInfoEntities {
	private final Cabinet cabinet;
	private final LentHistory lentHistory;
	private final User user;

	@QueryProjection
	public ActiveCabinetInfoEntities(Cabinet cabinet, LentHistory lentHistory, User user) {
		this.cabinet = cabinet;
		this.lentHistory = lentHistory;
		this.user = user;
	}
}