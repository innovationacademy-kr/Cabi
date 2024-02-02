package org.ftclub.cabinet.event;

import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cqrs.manager.CqrsManager;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@NoArgsConstructor
public class CqrsEventListener {

	private CqrsManager cqrsManager;

	@Autowired
	public CqrsEventListener(CqrsManager cqrsManager) {
		this.cqrsManager = cqrsManager;
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
	public void onPostUpdate(Object object) {
		log.info("onPostUpdate {}", object.toString());
		if (object instanceof LentHistory) {
			LentHistory lentHistory = (LentHistory) object;
			// LentHistory Entity -> Redis에 수정사항 반영

		} else if (object instanceof Cabinet) {
			Cabinet cabinet = (Cabinet) object;
			cqrsManager.synchronizeCabinet(cabinet);
		}
	}
}
