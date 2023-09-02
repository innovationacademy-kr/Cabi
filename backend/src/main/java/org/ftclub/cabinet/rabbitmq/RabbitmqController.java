package org.ftclub.cabinet.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 --restart=unless-stopped rabbitmq:management
@RestController
@RequestMapping("rabbit")
@AllArgsConstructor
@Log4j2
public class RabbitmqController {

	private final RabbitPublisher rabbitPublisher;

	/**
	 * Simple Queue 테스트(Exchange 활용)
	 */
//	@GetMapping("/lent")
	@PostMapping("/cabinets/{cabinetId}")
	public void sendMessage(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId) {
		log.info("Called startLentCabinet user: {}, cabinetId: {}", user, cabinetId);
		RabbitMessage rabbitMessage =
				RabbitMessage.builder().cabinetId(cabinetId)
						.userId(user.getUserId()).build();
		rabbitPublisher.sendMessage(rabbitMessage);
/*
		IntStream.range(0, 100).forEachOrdered(n -> {
			rabbitMessage.setId(String.valueOf(n));
			rabbitPublisher.sendMessage(rabbitMessage);
		});

 */
	}
}