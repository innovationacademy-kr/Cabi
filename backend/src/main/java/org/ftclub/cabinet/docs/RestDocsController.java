package org.ftclub.cabinet.docs;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/v4/docs")
public class RestDocsController {

	@GetMapping
	public String index() {
		return "docs/index.html";
	}
}
