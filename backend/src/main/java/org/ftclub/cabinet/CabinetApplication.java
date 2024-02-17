package org.ftclub.cabinet;

import org.ftclub.cabinet.config.CorsConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableFeignClients
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@EnableJpaAuditing
@Import({CorsConfig.class})
// @CrossOrigin(origins = {"*"}, allowedHeaders = {"*"}, originPatterns = {"*"})
public class CabinetApplication {

	public static void main(String[] args) {
		SpringApplication.run(CabinetApplication.class, args);
	}

}
