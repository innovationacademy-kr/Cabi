package org.ftclub.cabinet.cqrs.domain;

import java.util.HashMap;
import java.util.Map;
import org.ftclub.cabinet.cqrs.respository.CqrsSuffix;
import org.springframework.stereotype.Component;

@Component
public class CqrsLockCollection {

	private final Map<String, Object> lockMap = new HashMap<>();

	protected CqrsLockCollection() {
		for (CqrsSuffix suffix : CqrsSuffix.values()) {
			lockMap.put(suffix.getValue(), new Object());
		}
	}

	public Object getLock(CqrsSuffix suffix) {
		return lockMap.get(suffix.getValue());
	}
}
