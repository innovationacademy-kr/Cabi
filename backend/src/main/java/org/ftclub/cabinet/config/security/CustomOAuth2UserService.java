package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private final ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * oauth 로그인을 마친 유저의 프로필을 해당 사이트로부터 받아오고,
	 * <p>
	 * SecurityContextHolder 에 정보를 저장합니다.
	 * <p>
	 * 메서드들은 application.yml에 명시된 값들을 호출합니다
	 *
	 * @param userRequest
	 * @return
	 * @throws OAuth2AuthenticationException
	 */
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		try {
			OAuth2User oAuth2User = super.loadUser(userRequest);
			JsonNode rootNode =
					objectMapper.convertValue(oAuth2User.getAttributes(), JsonNode.class);
			// oauth 로그인 위치 ex) google, ft
			String provider = userRequest.getClientRegistration().getRegistrationId();
			// yml에 명시된 정보를 받아오는 키워드 ex) 42 oauth -> login, google -> sub
			String userNameAttribute =
					userRequest.getClientRegistration()
							.getProviderDetails()
							.getUserInfoEndpoint()
							.getUserNameAttributeName();

			// 고유 id ex) 42 -> intraName, google -> uid
			String userId = rootNode.path(userNameAttribute).asText();

			if (provider.equals("ft")) {
				return generateFtOauthProfile(
						rootNode, oAuth2User.getAttributes(), provider, userId);
			}
			return new CustomOauth2User(provider, userId, oAuth2User.getAttributes());
		} catch (OAuth2AuthenticationException e) {
			log.error("OAuth2 Authentication Exception : {}", e.getMessage(), e);
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}
	}

	// 블랙홀, 롤, userId, email
	private CustomOauth2User generateFtOauthProfile(JsonNode rootNode,
			Map<String, Object> oauthAttribute, String provider, String userId) {
		LocalDateTime blackHoledAt = determineBlackHoledAt(rootNode);
		FtRole role = determineFtRole(rootNode, blackHoledAt);
		Map<String, Object> attribute = new HashMap<>();
		attribute.put("email", oauthAttribute.get("email"));
		attribute.put("blackHoledAt", blackHoledAt);
		attribute.put("role", role);

		return new CustomOauth2User(provider, userId, attribute);
	}

	private FtRole determineFtRole(JsonNode rootNode, LocalDateTime blackHoledAt) {
		boolean isUserStaff = rootNode.get("staff?").asBoolean();
		boolean isActive = rootNode.get("active?").asBoolean();

		if (!isActive && blackHoledAt.isAfter(LocalDateTime.now())) {
			return FtRole.AGU;
		}
		if (!isActive) {
			return FtRole.INACTIVE;
		}
		if (isUserStaff) {
			return FtRole.STAFF;
		}
		return FtRole.USER;
	}

	private LocalDateTime determineBlackHoledAt(JsonNode rootNode) {
		return Optional.ofNullable(rootNode.path("cursus_users").path(1).path("blackholed_at"))
				.filter(JsonNode::isTextual)
				.map(JsonNode::asText)
				.filter(text -> !text.isEmpty())
				.map(DateUtil::convertStringToDate)
				.orElse(null);
	}
}
