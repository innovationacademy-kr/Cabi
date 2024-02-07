package org.ftclub.cabinet.ping;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.utils.overdue.manager.OverdueManager;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
@RequiredArgsConstructor
@Log4j2
public class PingController {

	private final LentFacadeService lentFacadeService;
	private final OverdueManager overdueManager;

	@RequestMapping
	public String ping() {
		return "pong";
	}

//	@RequestMapping("/pong")
//	public String ok() {
//		log.debug("called ok");
//		List<ActiveLentHistoryDto> activeLents = lentFacadeService.getAllActiveLentHistories();
//		//activeLents 에서 wchae를 찾아서 overdueManager.handleOverdue(wchae) 호출
//		ActiveLentHistoryDto wchae = activeLents.stream()
//				.filter(lent -> lent.getName().equals("wchae")).findFirst().get();
////        ActiveLentHistoryDto wchae = new ActiveLentHistoryDto(94L, "wchae", "wchae@student.42seoul.kr", 1L, false, -1L);
//		overdueManager.handleOverdue(wchae);
//		return "ok";
//	}

//	@RequestMapping("/pong")
//	public String ok(){
//		lentExtensionService.issueLentExtension();
//		return "ok";
//	}
}
