package org.ftclub.cabinet.event;

import javax.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.RecordApplicationEvents;

/**
 * 이벤트 리스너 테스트
 * <p>
 * {@link RecordApplicationEvents}를 통해 이벤트를 기록하고, {@link ApplicationEvents}를 통해 이벤트를 조회할 수 있습니다.
 */
@SpringBootTest
@RecordApplicationEvents
@Transactional
class LentEventListenerTest {

	@Autowired
	EventTestService eventTestService;
	
	@Test
	void test() {
		eventTestService.evokeEvent();
	}

}