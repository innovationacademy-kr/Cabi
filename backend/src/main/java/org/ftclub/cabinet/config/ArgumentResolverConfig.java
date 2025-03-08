//package org.ftclub.cabinet.config;
//
//import java.util.List;
//import lombok.RequiredArgsConstructor;
//import org.ftclub.cabinet.user.domain.UserSessionArgumentResolver;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.method.support.HandlerMethodArgumentResolver;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//@RequiredArgsConstructor
//public class ArgumentResolverConfig implements WebMvcConfigurer {
//
//	private final UserSessionArgumentResolver userSessionArgumentResolver;
//
//	@Override
//	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
//		resolvers.add(userSessionArgumentResolver);
//	}
//}
