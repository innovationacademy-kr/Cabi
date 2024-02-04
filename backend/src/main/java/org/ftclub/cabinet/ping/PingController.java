package org.ftclub.cabinet.ping;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
@RequiredArgsConstructor
@Log4j2
public class PingController {

	//	private final LentExtensionService lentExtensionService;
//	private final LentFacadeService lentFacadeService;
//	private final OverdueManager overdueManager;

	@RequestMapping
	public String ping() {
		return "pong";
	}

//	@RequestMapping("/pong")
//	public String ok() {
//		log.debug("called ok");
//		List<ActiveLentHistoryDto> activeLents = lentFacadeService.getAllActiveLentHistories();
//		List<ActiveLentHistoryDto> collect = activeLents.stream()
//				.filter(activeLent -> activeLent.getUserId().equals(94L))
//				.collect(Collectors.toList());
//		ActiveLentHistoryDto wchae = collect.get(0);
//		log.info("{}", wchae);
//		overdueManager.handleOverdue(collect.get(0));
//		return "ok";
//	}

//	@RequestMapping("/pong")
//	public String ok(){
//		lentExtensionService.issueLentExtension();
//		return "ok";
//	}
}
