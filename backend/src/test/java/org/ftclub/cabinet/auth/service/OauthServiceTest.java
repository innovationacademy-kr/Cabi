package org.ftclub.cabinet.auth.service;

import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.auth.OauthService;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;

@SpringBootTest
public class OauthServiceTest {

	@Autowired
	OauthService oauthService;

	@Test
	void 구글_로그인_요청() throws IOException {
		MockHttpServletResponse response = new MockHttpServletResponse();

		oauthService.sendToGoogleApi(response);

		Assert.assertEquals(response.getStatus(), HttpServletResponse.SC_FOUND);
	}

	@Test
	@Ignore("직접 요청을 보내야 하므로 제외함")
	void 구글_토큰_요청() {
	}

	@Test
	@Ignore("직접 요청을 보내야 하므로 제외함")
	void 구글_프로필_가져오기() {
	}

	@Test
	void Ft_로그인_요청() throws IOException {
		MockHttpServletResponse response = new MockHttpServletResponse();

		oauthService.sendToFtApi(response);

		Assert.assertEquals(response.getStatus(), HttpServletResponse.SC_FOUND);
	}

	@Test
	@Ignore("직접 요청을 보내야 하므로 제외함")
	void Ft_토큰_요청() {
	}

	@Test
	@Ignore("직접 요청을 보내야 하므로 제외함")
	void Ft_프로필_가져오기() {
	}

}
