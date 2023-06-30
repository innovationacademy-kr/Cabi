package org.ftclub.cabinet.event;

import java.time.LocalDateTime;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * 예시를 위한 서비스입니다. 메일링, 알림 등을 구현하는 서비스라고 가정하고 테스트 용으로 작성했습니다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class EventTestService {

	// 이벤트를 발행할 수 있도록 ApplicationEventPublisher를 주입받습니다 - 스프링에서 제공하는 기본 빈입니다.
	private final ApplicationEventPublisher publisher;

	// 이벤트를 핸들링하는(메일링, 알람 수행) 가짜 메서드입니다.
	public void sendMail(LentStartEvent event) {
		System.out.println("Service : 아래 정보에 따라 메일을 날리겠다!!\n" + event);
	}

	// 이벤트를 발행하는(대여 완료) 가짜 메서드입니다. 테스트를 위해 Listen과 Publish가 같이 있지만, 실제 구현 시에는 분리됩니다.
	public void evokeEvent() {
		publisher.publishEvent(
				LentStartEvent.of(
						"까비",
						"ccabi@cabi.oopy.io",
						LocalDateTime.now(),
						Location.of("까비네 집", 2, "방구석"),
						42));
	}
}
