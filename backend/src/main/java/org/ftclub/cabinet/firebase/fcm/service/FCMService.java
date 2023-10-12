package org.ftclub.cabinet.firebase.fcm.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.redis.service.RedisService;
import org.ftclub.cabinet.utils.overdue.manager.OverdueType;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMService {
	private final RedisService redisService;
	private final DomainProperties domainProperties;
	private static final String ICON_FILE_PATH = "/src/assets/images/logo.svg";


	public void sendPushMessage(String name, OverdueType overdueType, Long daysLeftFromExpireDate) {
		log.info("called sendPushMessage name = {}, overdueType = {}, daysLeftFromExpireDate = {}", name, overdueType,
				daysLeftFromExpireDate);

		Optional<String> token = redisService.findByKey(name, String.class);
		if (token.isEmpty()) {
			log.warn("\"{}\"에 해당하는 디바이스 토큰이 존재하지 않습니다.", name);
			return;
		}

		switch (overdueType) {
			case NONE:
				log.warn("overdueType이 NONE입니다. name = {}, overdueType = {}, daysLeftFromExpireDate = {}", name, overdueType,
						daysLeftFromExpireDate);
				break;
			case SOON_OVERDUE:
				sendSoonOverdueMessage(token.get(), name, daysLeftFromExpireDate);
				break;
			case OVERDUE:
				sendOverdueMessage(token.get(), name, daysLeftFromExpireDate);
				break;
		}
	}

	private void sendOverdueMessage(String token, String name, Long daysLeftFromExpireDate) {
		log.info(
				"called sendOverdueMessage token = {}, name = {}, daysLeftFromExpireDate = {}",
				token, name, daysLeftFromExpireDate);
		System.out.println(domainProperties.getFeHost() + "/" + ICON_FILE_PATH);
		Message message = Message.builder()
				.putData("title", "<CABI> 연체 알림")
				.putData("body", name + "님, 대여한 사물함이 " + Math.abs(daysLeftFromExpireDate) + "일 연체되었습니다.")
				.putData("icon", domainProperties.getFeHost() + "/" + ICON_FILE_PATH)
				.putData("click_action", domainProperties.getFeHost())
				.setToken(token)
				.build();

		FirebaseMessaging.getInstance().sendAsync(message);
	}

	private void sendSoonOverdueMessage(String token, String name, Long daysLeftFromExpireDate) {
		log.info(
				"called sendSoonOverdueMessage token = {}, name = {}, daysLeftFromExpireDate = {}",
				token, name, daysLeftFromExpireDate);
		if (token.isEmpty()) {
			log.warn("\"{}\"에 해당하는 디바이스 토큰이 존재하지 않습니다.", name);
			return;
		}
		Message message = Message.builder()
				.putData("title", "<CABI> 연체 예정 알림")
				.putData("body", "대여한 사물함이 " + daysLeftFromExpireDate + "일 후 연체됩니다.")
				.putData("icon", domainProperties.getFeHost() + "/" + ICON_FILE_PATH)
				.putData("click_action", domainProperties.getFeHost())
				.setToken(token)
				.build();

		FirebaseMessaging.getInstance().sendAsync(message);
	}
}
