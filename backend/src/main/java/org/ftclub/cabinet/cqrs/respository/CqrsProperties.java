package org.ftclub.cabinet.cqrs.respository;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class CqrsProperties {

	private static final String CABINET_PER_SECTION = ":cabinetPerSection";
	private static final String CABINET_STATUS = ":cabinetStatus";
	private static final String CABINET_LENT_HISTORIES = ":cabinetLentHistories";
	private static final String CABINET_VISIBLE_NUM = ":cabinetVisibleNum";
	private static final String CABINET_INFO = ":cabinetInfo";

	private static final String USER_BAN = ":userBan";
	private static final String USER_CLUBS = ":userClubs";
	private static final String USER_NAME = ":userName";
	private static final String USER_LENT_HISTORIES = ":userLentHistories";
	private static final String USER_INFO = ":userInfo";

	private static final String LENT_COUNT = ":lentCount";
	private static final String LENT_INFO = ":lentInfo";
	private static final String BUILDINGS = ":buildings";
	private static final String PENDING_CABINET = ":pendingCabinet";

	private static final String CLUBS = ":clubs";
	private static final String CLUB_CABINETS = ":clubCabinets";

	private static final String STATISTICS = ":statistics";
}
