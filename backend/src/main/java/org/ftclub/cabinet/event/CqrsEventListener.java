package org.ftclub.cabinet.event;

import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cqrs.manager.CqrsManager;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Component;

@Logging
@Component
public class CqrsEventListener {

	private static CqrsManager cqrsManager;

	/**
	 * CqrsManager를 수정자 주입 방식으로 주입받는다.(리플렉션으로 생성되기 때문에 생성자 주입이 불가능하다.)
	 * <p>
	 * 사용 금지!!!!
	 * </p>
	 */
	@Deprecated
	public void setCqrsManager(CqrsManager cqrsManager) {
		CqrsEventListener.cqrsManager = cqrsManager;
	}

	@PostPersist
	public void onPostPersist(Object object) {
		if (object instanceof LentHistory) {
			LentHistory lentHistory = (LentHistory) object;
			cqrsManager.changeCabinetLentHistory(lentHistory);
		}
	}

	@PostUpdate
	public void onPostUpdate(Object object) {
		if (object instanceof LentHistory) {
			LentHistory lentHistory = (LentHistory) object;
			cqrsManager.changeCabinetLentHistory(lentHistory);
		}
		if (object instanceof Cabinet) {
			cqrsManager.changeCabinet((Cabinet) object);
		}
	}
}
