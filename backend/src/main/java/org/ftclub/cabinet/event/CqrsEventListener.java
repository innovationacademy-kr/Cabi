package org.ftclub.cabinet.event;

import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cqrs.manager.CqrsManager;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Component
public class CqrsEventListener {

	private static CqrsManager cqrsManager;

	// CqrsManager를 수정자 주입 방식으로 주입받는다.(리플렉션으로 생성되기 때문에 생성자 주입이 불가능하다.)
	public void setCqrsManager(CqrsManager cqrsManager) {
		CqrsEventListener.cqrsManager = cqrsManager;
	}

	@PostPersist
	public void onPostPersist(Object object) {
		log.info("onPostPersist {}", object.toString());
		if (object instanceof LentHistory) {
			LentHistory lentHistory = (LentHistory) object;
			// LentHistory Entity -> Redis 저장

		} else if (object instanceof Cabinet) {
			Cabinet cabinet = (Cabinet) object;
			// Cabinet Entity -> Redis 저장
		}
	}

	@PostUpdate
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void onPostUpdate(Object object) {
		log.info("onPostUpdate {}", object.toString());
		if (object instanceof LentHistory) {
			LentHistory lentHistory = (LentHistory) object;
			// LentHistory Entity -> Redis에 수정사항 반영
		} else if (object instanceof Cabinet) {
			cqrsManager.synchronizeCabinet((Cabinet) object);
		}
	}
}
