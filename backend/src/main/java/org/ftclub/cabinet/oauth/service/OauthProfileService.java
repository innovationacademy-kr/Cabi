package org.ftclub.cabinet.oauth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.oauth.domain.FtOauthProfile;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class OauthProfileService {

	@Value("${spring.security.oauth2.client.provider.ft.users-info-uri}")
	private String ftUsersInfoUri;

	/**
	 * 42에서 발급한 accessToken을 활용해 유저의 정보를 받아옵니다
	 *
	 * @param accessToken 42 API에 전달할 access_token
	 * @param intraName   유저 intraName
	 * @return 유저 프로필정보 {@link FtOauthProfile}
	 * @throws JsonProcessingException
	 */
	public FtOauthProfile getProfileByIntraName(String accessToken, String intraName)
			throws JsonProcessingException {
		log.info("Called getProfileByIntraName {}", intraName);
		JsonNode result = WebClient.create().get()
				.uri(ftUsersInfoUri + '/' + intraName)
				.accept(MediaType.APPLICATION_JSON)
				.headers(h -> h.setBearerAuth(accessToken))
				.retrieve()
				.bodyToMono(JsonNode.class)
				.block();

		return convertJsonNodeToFtOauthProfile(result);
	}

	/**
	 * 42 로그인 시 받은 jsonNode -> FtOauthProfile 객체 변환
	 *
	 * @param rootNode
	 * @return
	 */
	public FtOauthProfile convertJsonNodeToFtOauthProfile(JsonNode rootNode) {
		String intraName = rootNode.get("login").asText();
		String email = rootNode.get("email").asText();
		if (intraName == null || email == null) {
			throw ExceptionStatus.INCORRECT_ARGUMENT.asServiceException();
		}

		JsonNode mainCursus = find42CursusNode(rootNode);
		LocalDateTime blackHoledAt = determineBlackHoledAt(mainCursus);
		Set<FtRole> roles = determineFtRoles(rootNode, mainCursus, blackHoledAt);
		return FtOauthProfile.builder()
				.intraName(intraName)
				.email(email)
				.roles(roles)
				.blackHoledAt(blackHoledAt)
				.build();
	}

	private JsonNode find42CursusNode(JsonNode rootNode) {
		JsonNode cursusUsers = rootNode.get("cursus_users");

		for (JsonNode cursusUser : cursusUsers) {
			JsonNode cursus = cursusUser.get("cursus");
			if ("42cursus".equals(cursus.get("slug").asText())) {
				return cursusUser;
			}
		}
		return null;
	}

	public Set<FtRole> determineFtRoles(JsonNode rootNode, JsonNode mainCursus,
			LocalDateTime blackHoledAt) {
		boolean isUserStaff = rootNode.get("staff?").asBoolean();
		boolean isActive = rootNode.get("active?").asBoolean();
		Set<FtRole> roles = new HashSet<>();

		// inactive에 대해서는 단일 권한을 반환. inactive / blackhole
		if (!isActive) {
			addInactiveRoles(blackHoledAt, roles);
			return roles;
		}
		// user -> 여러 권한 핸들링.
		if (mainCursus == null) {
			roles.add(FtRole.PISCINER);
			return roles;
		}

		roles.add(FtRole.USER);
		if (isUserStaff) {
			roles.add(FtRole.STAFF);
		}
		if (blackHoledAt == null) {
			roles.add(FtRole.MEMBER);
		} else {
			roles.add(FtRole.CADET);
		}
		return roles;
	}

	private void addInactiveRoles(LocalDateTime blackHoledAt, Set<FtRole> roles) {
		if (blackHoledAt != null && blackHoledAt.isAfter(LocalDateTime.now())) {
			roles.add(FtRole.AGU);
		} else {
			roles.add(FtRole.INACTIVE);
		}
	}

	private LocalDateTime determineBlackHoledAt(JsonNode mainCursus) {
		return Optional.ofNullable(mainCursus)
				.map(cursus -> cursus.get("blackholed_at"))
				.filter(node -> !node.isNull() && !node.asText().isEmpty())
				.map(node -> DateUtil.convertStringToDate(node.asText()))
				.orElse(null);
	}
}
