package org.ftclub.cabinet.docs;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/docs")
public class DocsConroller {

	@GetMapping
	public String getDocs() {
		return "docs/index.html";
	}
}
