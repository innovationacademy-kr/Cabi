package org.ftclub.cabinet.event;

import org.hibernate.event.spi.PostInsertEvent;
import org.hibernate.event.spi.PostInsertEventListener;
import org.hibernate.persister.entity.EntityPersister;

public class InsertEventListener implements PostInsertEventListener {

	@Override
	public void onPostInsert(PostInsertEvent postInsertEvent) {
		System.out.println("InsertEventListener.onPostInsert");
	}

	@Override
	public boolean requiresPostCommitHanding(EntityPersister entityPersister) {
		return true;
	}

	@Override
	public boolean requiresPostCommitHandling(EntityPersister persister) {
		return PostInsertEventListener.super.requiresPostCommitHandling(persister);
	}
}
