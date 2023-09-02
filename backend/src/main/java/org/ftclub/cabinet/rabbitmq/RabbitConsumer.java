package org.ftclub.cabinet.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Log4j2
public class RabbitConsumer {

	@RabbitListener(queues = "${spring.rabbitmq.queue-name}")
	public void consume(RabbitMessage message) {
		log.info("{}", message);
		log.info("uid = {}", message.getUserId());
		log.info("cid = {}", message.getCabinetId());
	}
}
