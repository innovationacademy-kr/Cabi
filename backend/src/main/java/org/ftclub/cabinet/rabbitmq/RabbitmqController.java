package org.ftclub.cabinet.rabbitmq;

import java.util.stream.IntStream;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
//docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 --restart=unless-stopped rabbitmq:management
@RestController
@RequestMapping("rabbit")
@AllArgsConstructor
public class RabbitmqController {

	private final RabbitPublisher rabbitPublisher;

	/**
	 * Simple Queue 테스트(Exchange 활용)
	 */
	@GetMapping("/send")
	public void sendMessage() {
		RabbitMessage rabbitMessage = RabbitMessage.builder().id("1").fName("First Name").lName("Last Name").build();

		IntStream.range(0, 100).forEachOrdered(n -> {
			rabbitMessage.setId(String.valueOf(n));
			rabbitPublisher.sendMessage(rabbitMessage);
		});
	}
}