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

@Component
@Order(1)
@WebFilter("/*")
public class TimeResponseFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		String currentTime = LocalDateTime.now().toString();
		// ServletResponse를 HttpServletResponse로 캐스트합니다.
		HttpServletResponse httpServletResponse = (HttpServletResponse) response;

		// 응답 헤더에 현재 시간을 추가합니다.
		httpServletResponse.addHeader("X-Current-Time", currentTime);

//		 다음 필터 또는 서블릿으로 요청을 전달합니다.
//		chain.doFilter(request, httpServletResponse);

		// 다음 필터 또는 서블릿으로 요청을 전달합니다.
		chain.doFilter(request, response);
	}


}
