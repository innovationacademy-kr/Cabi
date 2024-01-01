package org.ftclub.cabinet.ping;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.user.service.LentExtensionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
//@RequiredArgsConstructor
public class PingController {
//	private final LentExtensionService lentExtensionService;

	@RequestMapping
	public String ping() {
		return "pong";
	}

//	@RequestMapping("/pong")
//	public String ok(){
//		lentExtensionService.issueLentExtension();
//		return "ok";
//	}
}
