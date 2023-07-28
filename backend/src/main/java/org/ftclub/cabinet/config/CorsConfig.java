package org.ftclub.cabinet.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {

		registry.addMapping("/**")
				.allowedOrigins("https://cabi.42seoul.io")
				.allowedOrigins("https://dev.cabi.42seoul.io")
				.allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH")
				.allowCredentials(true)
				.maxAge(3600)
				.allowedHeaders("*");
	}

}
