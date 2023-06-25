package org.ftclub.cabinet.docs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/v4/docs")
@Slf4j
public class RestDocsController {

	@GetMapping
	public String index() {
		log.info("get /v4/docs");
		return "docs/index.html";
	}
}
