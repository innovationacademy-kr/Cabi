package org.ftclub.cabinet.config;

/**
 * ApiManager에 주입할 properties를 정의하는 인터페이스입니다.
 */
public interface ApiProperties {

    String getProviderName();

    String getClientId();

    String getClientSecret();

    String getRedirectUri();

    String getGrantType();

    String getTokenGrantType();

    String getAccessTokenName();

    String getTokenUri();

    String getAuthUri();

    String getUserInfoUri();

    String getScope();
}
