package org.ftclub.cabinet.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * 대여 도메인 이벤트 리스너입니다.
 */
@Component
@RequiredArgsConstructor
public class LentEventListener {

	private final EventTestService eventTestService;

	/**
	 * {@link TransactionalEventListener}(phase = TransactionPhase.AFTER_COMMIT) <- 롤백되지 않은 커밋 후에
	 * 이벤트를 발생시킵니다. 테스트 하기 힘들어서 현재는 {@link EventListener}로 해놓았지만, 트랜잭션 롤백시에 이벤트가 발생하면 안 되는 곳들에서 잘
	 * 사용해야 합니다.
	 */

	@EventListener // <- publish되면 무조건 listen 합니다.
	public void handleLentStartEvent(LentStartEvent event) {
		System.out.println("Listener : 이벤트 발생!!");
		eventTestService.sendMail(event);
		System.out.println("Listener : 메일 보냈다!");
	}


}
