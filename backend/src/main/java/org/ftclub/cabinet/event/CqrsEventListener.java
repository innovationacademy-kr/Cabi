package org.ftclub.cabinet.event;

import javax.persistence.PostPersist;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cqrs.service.CqrsService;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@NoArgsConstructor
public class CqrsEventListener {

	private CqrsService cqrsService;

	@Autowired
	public CqrsEventListener(CqrsService cqrsService) {
		this.cqrsService = cqrsService;
	}

	@PostPersist
	public void onPostPersist(Object object) {
		if (object instanceof LentHistory) {
			LentHistory lentHistory = (LentHistory) object;
			// LentHistory Entity -> Redis 저장

		}
		log.info("### onPostPersist {}", object.toString());
	}

}
