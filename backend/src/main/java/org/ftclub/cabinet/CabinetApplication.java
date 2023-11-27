	package org.ftclub.cabinet;

import org.ftclub.cabinet.config.CorsConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@ServletComponentScan
@Import({CorsConfig.class})
// @CrossOrigin(origins = {"*"}, allowedHeaders = {"*"}, originPatterns = {"*"})
public class CabinetApplication {

	public static void main(String[] args) {
		SpringApplication.run(CabinetApplication.class, args);
	}

}
