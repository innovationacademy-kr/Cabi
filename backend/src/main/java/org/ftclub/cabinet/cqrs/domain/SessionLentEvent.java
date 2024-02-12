package org.ftclub.cabinet.cqrs.domain;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class SessionLentEvent {

	private Long cabinetId;
	private List<Long> usersInSession;
}
