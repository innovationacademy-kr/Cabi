package org.ftclub.cabinet.auth.domain.scribejava;

import com.github.scribejava.apis.GoogleApi20;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.oauth.OAuth20Service;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ScribeJava 라이브러리를 이용한 OAuth2.0 서비스를 컨테이너에 등록하는 클래스입니다.
 */
@Configuration
public class OauthConfig {
	public static final String FT_OAUTH_20_SERVICE = "ftOauth20Service";
	public static final String GOOGLE_OAUTH_20_SERVICE = "googleOauth20Service";


	@Bean
	@Qualifier(FT_OAUTH_20_SERVICE)
	public OAuth20Service ftOauth20Service(FtApiProperties ftApiProperties) {
		return new ServiceBuilder(ftApiProperties.getClientId())
				.apiSecret(ftApiProperties.getClientSecret())
				.callback(ftApiProperties.getRedirectUri())
				.build(FtApi20.instance());
	}

	@Bean
	@Qualifier(GOOGLE_OAUTH_20_SERVICE)
	public OAuth20Service googleOauth20Service(GoogleApiProperties googleApiProperties) {
		return new ServiceBuilder(googleApiProperties.getClientId())
				.apiSecret(googleApiProperties.getClientSecret())
				.callback(googleApiProperties.getRedirectUri())
				.defaultScope("profile email")
				.build(GoogleApi20.instance());
	}
}
