package org.ftclub.cabinet.auth.domain.scribejava;

import com.github.scribejava.core.builder.api.DefaultApi20;

/**
 * ScribeJava 라이브러리에서 OAuth2.0 서비스를 생성할 때에 필요한 메타데이터를 담는 클래스입니다.
 * <p>
 * 참고 : {@link com.github.scribejava.apis.GoogleApi20}
 */
public class FtApi20 extends DefaultApi20 {

	public static FtApi20 instance() {
		return InstanceHolder.INSTANCE;
	}

	@Override
	public String getAccessTokenEndpoint() {
		return "https://api.intra.42.fr/oauth/token";
	}

	@Override
	protected String getAuthorizationBaseUrl() {
		return "https://api.intra.42.fr/oauth/authorize";
	}

	private static class InstanceHolder {
		private static final FtApi20 INSTANCE = new FtApi20();
	}
}
