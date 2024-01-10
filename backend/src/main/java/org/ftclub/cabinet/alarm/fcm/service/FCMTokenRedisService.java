package org.ftclub.cabinet.alarm.fcm.service;

import java.time.Duration;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.fcm.repository.FCMTokenRedis;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class FCMTokenRedisService {

	private final FCMTokenRedis fcmTokenRedis;


	/**
	 * 유저의 이름으로 토큰을 조회합니다.
	 *
	 * @param userName 유저 이름 (조회할 키)
	 * @return Optional<String> 조회된 값
	 */
	public Optional<String> findByUserName(String userName) {
		return fcmTokenRedis.findByKey(userName, String.class);
	}

	/**
	 * 유저의 이름으로 디바이스 토큰을 저장합니다.
	 *
	 * @param userName    유저 이름
	 * @param deviceToken 디바이스 토큰
	 * @param duration    저장할 기간
	 */
	public void saveToken(String userName, String deviceToken, Duration duration) {
		fcmTokenRedis.save(userName, deviceToken, duration);
	}

	/**
	 * 유저의 이름으로 디바이스 토큰을 삭제합니다.
	 *
	 * @param userName 유저 이름 (삭제할 키)
	 */
	public boolean deleteByUserName(String userName) {
		return fcmTokenRedis.delete(userName);
	}
}