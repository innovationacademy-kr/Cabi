package org.ftclub.cabinet.utils.lock;

import java.util.concurrent.ConcurrentHashMap;

public abstract class LockUtil {

	private final static ConcurrentHashMap<Long, Object> redisCoinLock = new ConcurrentHashMap<>();

	public static void lockRedisCoin(Long userId, VoidLock functionalInterface) {
		Object lock = redisCoinLock.computeIfAbsent(userId, v -> new Object());
		synchronized (lock) {
			functionalInterface.invoke();
		}
		redisCoinLock.remove(userId);
	}

	public static int lockRedisCoin(Long userId, IntegerLock functionalInterface) {
		Object lock = redisCoinLock.computeIfAbsent(userId, v -> new Object());
		int result;
		synchronized (lock) {
			result = functionalInterface.invoke();
		}
		redisCoinLock.remove(userId);
		return result;
	}
}
