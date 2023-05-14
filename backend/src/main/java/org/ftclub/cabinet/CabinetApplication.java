package org.ftclub.cabinet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class CabinetApplication {

	public static void main(String[] args) {

		SpringApplication.run(CabinetApplication.class, args);
	}

}
