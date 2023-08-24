package org.ftclub.cabinet.cache;

import java.util.List;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@EnableCaching
@Configuration
public class CacheConfig {

	@Bean
	public CacheManager cacheManager() {
		ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
		cacheManager.setAllowNullValues(false);
		cacheManager.setCacheNames(List.of("cabinets"));
		return cacheManager;
	}
}
