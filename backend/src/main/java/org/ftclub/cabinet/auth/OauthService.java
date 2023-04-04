package org.ftclub.cabinet.auth;

import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Service
public class OauthService {

	@Autowired
	private ApiUriBuilder apiUriBuilder;
	@Autowired
	private GoogleApiProperties googleApiProperties;
	@Autowired
	private FtApiProperties ftApiProperties;

	public void sendToGoogleApi(HttpServletResponse response) throws IOException {
		response.sendRedirect(
				apiUriBuilder.buildCodeUri(
				googleApiProperties.getAuthUri(),
				googleApiProperties.getClientId(),
				googleApiProperties.getRedirectUri(),
				googleApiProperties.getScope(),
				googleApiProperties.getGrantType())
		);
	}

	public String getGoogleToken(String code) {
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // POST PATCH..
		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("grant_type", "authorization_code");
		map.add("client_id", googleApiProperties.getClientId());
		map.add("client_secret", googleApiProperties.getClientSecret());
		map.add("redirect_uri", googleApiProperties.getRedirectUri());
		map.add("code", code); // 이쁘게 만드는 방법이 있을까?

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

		ResponseEntity<String> response = restTemplate.postForEntity(googleApiProperties.getTokenUri(), request, String.class);
		JSONObject json = new JSONObject(response.getBody());

		return json.get("access_token").toString();
	}


	public JSONObject getGoogleProfile(String token) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.setBearerAuth(token);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.exchange(googleApiProperties.getUserInfoUri(), HttpMethod.GET, requestEntity, String.class);
		JSONObject profile = null;

		if (response.getStatusCode() == HttpStatus.OK) {
			profile = new JSONObject(response.getBody());
		} else {
			System.err.println("Error: " + response.getStatusCode());
		}
		return profile;
	}

	public void sendToFtApi(HttpServletResponse response) throws IOException {
		String dir = apiUriBuilder.buildCodeUri(
				ftApiProperties.getAuthUri(),
				ftApiProperties.getClientId(),
				ftApiProperties.getRedirectUri(),
				ftApiProperties.getScope(),
				ftApiProperties.getGrantType());
		System.out.printf("%s\n", dir);
		response.sendRedirect(dir);
	}

	public String getFtToken(String code) {
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // POST PATCH..
		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("grant_type", "authorization_code");
		map.add("client_id", ftApiProperties.getClientId());
		map.add("client_secret", ftApiProperties.getClientSecret());
		map.add("redirect_uri", ftApiProperties.getRedirectUri());
		map.add("code", code); // 이쁘게 만드는 방법이 있을까?

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

		ResponseEntity<String> response = restTemplate.postForEntity(ftApiProperties.getTokenUri(), request, String.class);
		JSONObject json = new JSONObject(response.getBody());

		return json.get("access_token").toString();
	}
	public JSONObject getFtProfile(String token) {
		HttpHeaders headers = new HttpHeaders();
		RestTemplate restTemplate = new RestTemplate();
		headers.setBearerAuth(token);
		HttpEntity<String> requestEntity = new HttpEntity<String>("parameters", headers);
		ResponseEntity<String> response = restTemplate.exchange(
				ftApiProperties.getUserInfoUri(),
				HttpMethod.GET,
				requestEntity,
				String.class);
		JSONObject profile = null;
		if (response.getStatusCode() == HttpStatus.OK) {
			profile = new JSONObject(response.getBody());
		} else {
			System.err.println("Error: " + response.getStatusCode());
		}
		return profile;
	}
}
