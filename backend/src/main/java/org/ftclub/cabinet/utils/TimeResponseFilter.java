package org.ftclub.cabinet.utils;

import java.io.IOException;
import java.time.LocalDateTime;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * 모든 응답에 X-Current-Time 헤더를 추가하는 필터
 */
@Component
@Order(1)
@WebFilter("/*")
public class TimeResponseFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		String currentTime = LocalDateTime.now().toString();
		HttpServletResponse httpServletResponse = (HttpServletResponse) response;
		httpServletResponse.addHeader("X-Current-Time", currentTime);
		chain.doFilter(request, response);
	}


}
