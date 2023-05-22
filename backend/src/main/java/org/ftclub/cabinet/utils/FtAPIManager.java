package org.ftclub.cabinet.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * 42API를 사용하기 위한 클래스
 * TODO: 추후 Spring Security를 적용하면 삭제 예정
 */
@Component
@RequiredArgsConstructor
public class FtAPIManager {

    private final FtApiProperties ftApiProperties;
    private String accessToken;

    /**
     * 42 토큰을 발급받는다.
     */
    public void issueAccessToken() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");

        map.add("client_id", this.ftApiProperties.getClientId());
        map.add("client_secret", this.ftApiProperties.getClientSecret());
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    this.ftApiProperties.getTokenUri(), request,
                    String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode accessToken = root.get(this.ftApiProperties.getAccessTokenName());
            this.accessToken = accessToken.asText();
        } catch (Exception e) {
            throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
        }
    }

    /**
     * 42API를 통해 특정 유저의 정보를 가져온다.
     *
     * @param name 유저의 이름
     * @return JsonNode 형태의 유저 정보
     */
    public JsonNode getFtUserInfo(String name) throws Exception {
        int tryCount = 0;
        while (tryCount < 3) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                headers.setBearerAuth(this.accessToken);
                HttpEntity<String> requestEntity = new HttpEntity<String>("parameters", headers);
                String requestUri = this.ftApiProperties.getUsersInfoUri() + '/' + name;
                ResponseEntity<String> responseEntity = restTemplate.exchange(requestUri,
                        HttpMethod.GET,
                        requestEntity,
                        String.class);
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(responseEntity.getBody());
                return root;
            } catch (Exception e) {
                e.printStackTrace();
                this.issueAccessToken();
                tryCount++;
                if (tryCount == 3) {
                    throw e;
                }
            }
        }
        return null;
    }
}
