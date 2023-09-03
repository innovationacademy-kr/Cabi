package org.ftclub.cabinet.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class RabbitConsumer {
	private final LentFacadeService lentFacadeService;

	@RabbitListener(queues = "${spring.rabbitmq.queue-name}")
	public void consume(RabbitMessage message) {
		log.info("Received message from RabbitMQ: {}", message);
		lentFacadeService.startLentCabinet(message.getUserId(), message.getCabinetId());

	}
	@RabbitListener(queues = "${spring.rabbitmq.queue-error}")
	public void consumeError(RabbitMessage message) {
		log.info("Received message from RabbitMQ: {}", message);
	}

}
