package org.ftclub.cabinet.auth.service;

import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class OauthServiceUnitTest {

    @Autowired
    OauthService oauthService;

    @Autowired
    GoogleApiProperties googleApiProperties;

    @Autowired
    FtApiProperties ftApiProperties;

    @Test
    void 구글_로그인_요청() throws IOException {
        MockHttpServletResponse response = new MockHttpServletResponse();

        oauthService.sendToApi(response, googleApiProperties);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_FOUND);
    }

    @Test
    @Disabled("직접 요청을 보내야 하므로 제외함")
    void 구글_토큰_요청() {
    }

    @Test
    @Disabled("직접 요청을 보내야 하므로 제외함")
    void 구글_프로필_가져오기() {
    }

    @Test
    void Ft_로그인_요청() throws IOException {
        MockHttpServletResponse response = new MockHttpServletResponse();

        oauthService.sendToApi(response, ftApiProperties);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_FOUND);
    }

    @Test
    @Disabled("직접 요청을 보내야 하므로 제외함")
    void Ft_토큰_요청() {
    }

    @Test
    @Disabled("직접 요청을 보내야 하므로 제외함")
    void Ft_프로필_가져오기() {
    }

}
