package org.ftclub.cabinet.rabbitmq;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@Log4j2
@RequiredArgsConstructor
public class Producer {
	private final RabbitTemplate rabbitTemplate;

	public void sendMessage(){
		log.info("Sent message to RabbitMQ");
		rabbitTemplate.convertAndSend("hello.exchange", "hello.key", "Hello, RabbitMQ!");
	}
}
