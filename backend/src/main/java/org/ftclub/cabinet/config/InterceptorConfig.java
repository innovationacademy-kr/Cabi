package org.ftclub.cabinet.config;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.log.AllRequestLogInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer {

	private final AllRequestLogInterceptor allRequestLogInterceptor;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(allRequestLogInterceptor)
				.addPathPatterns("/**");
	}
}