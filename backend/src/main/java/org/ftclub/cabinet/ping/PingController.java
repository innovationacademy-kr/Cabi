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
//    private final OverdueManager overdueManager;

    @RequestMapping
    public String ping() {
        return "pong";
    }

//    @RequestMapping("/pong")
//    public String ok() {
//        log.debug("called ok");
//        ActiveLentHistoryDto wchae = new ActiveLentHistoryDto(94L, "wchae", "wchae@student.42seoul.kr", 1L, false, -1L);
//        overdueManager.handleOverdue(wchae);
//        return "ok";
//    }

//	@RequestMapping("/pong")
//	public String ok(){
//		lentExtensionService.issueLentExtension();
//		return "ok";
//	}
}
