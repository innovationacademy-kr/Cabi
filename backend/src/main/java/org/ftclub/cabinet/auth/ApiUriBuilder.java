package org.ftclub.cabinet.auth;

import org.springframework.stereotype.Component;

@Component
public class ApiUriBuilder {

    public String buildCodeUri(String authUri, String clientId, String redirectUri, String scope,
            String grantType) {
        return String.format("%s?client_id=%s&redirect_uri=%s&scope=%s&response_type=%s",
                authUri, clientId, redirectUri, scope, grantType);
    }

    public String buildTokenUri(String authUri, String clientId, String clientSecret,
            String grantType, String redirectUri) {
        return String.format("%s?client_id=%s&client_secret=%s&grantType=%s&redirectUri=%s",
                authUri, clientId, clientSecret, grantType, redirectUri);
    }

    public String buildProfileUri(String userInfoUri, String accessToken) {
        return String.format("%s?access_token=%s",
                userInfoUri, accessToken);
    }
}
