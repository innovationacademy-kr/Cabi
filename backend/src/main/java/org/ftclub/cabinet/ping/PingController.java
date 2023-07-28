package org.ftclub.cabinet.ping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
public class PingController {

	@RequestMapping
	public String ping() {
		return "pong";
	}
}
