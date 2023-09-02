package org.ftclub.cabinet.rabbitmq;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitPublisher {

	private final RabbitTemplate rabbitTemplate;
	private final TopicExchange topicExchange;

	public void sendMessage(RabbitMessage message) {
		rabbitTemplate.convertAndSend(topicExchange.getName(), "hello.key.1", message);
	}

	public void sendMessage2(RabbitMessage message) {
		rabbitTemplate.convertAndSend(topicExchange.getName(), "hello.key.2", message);
	}

}
