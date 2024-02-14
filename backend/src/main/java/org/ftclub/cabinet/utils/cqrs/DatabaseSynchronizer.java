package org.ftclub.cabinet.utils.cqrs;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.club.service.ClubFacadeService;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableScheduling
public class DatabaseSynchronizer {

	private final CabinetFacadeService cabinetFacadeService;
	private final LentFacadeService lentFacadeService;
	private final UserFacadeService userFacadeService;
	private final ClubFacadeService clubFacadeService;

}
