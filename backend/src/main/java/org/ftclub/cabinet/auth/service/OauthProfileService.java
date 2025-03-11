package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OauthProfileService {

	private static final int PISCINE_INDEX = 0;
	private static final int CADET_INDEX = 1;

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

		LocalDateTime blackHoledAt = determineBlackHoledAt(rootNode);
		Set<FtRole> roles = determineFtRoles(rootNode, blackHoledAt);
		return FtOauthProfile.builder()
				.intraName(intraName)
				.email(email)
				.roles(roles)
				.blackHoledAt(blackHoledAt)
				.build();
	}

	public Set<FtRole> determineFtRoles(JsonNode rootNode, LocalDateTime blackHoledAt) {
		boolean isUserStaff = rootNode.get("staff?").asBoolean();
		boolean isActive = rootNode.get("active?").asBoolean();
		JsonNode cursusUsersNode = rootNode.get("cursus_users");
		Set<FtRole> roles = new HashSet<>();

		// inactive에 대해서는 단일 권한을 반환. inactive / blackhole
		if (!isActive) {
			return handleInactiveUser(blackHoledAt, roles);
		}
		// user -> 여러 권한 핸들링.
		roles.add(FtRole.USER);
		if (cursusUsersNode.size() < CADET_INDEX + 1) {
			roles.add(FtRole.PISCINER);
		}
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

	private LocalDateTime determineBlackHoledAt(JsonNode rootNode) {
		JsonNode cursusNode = rootNode.get("cursus_users");
		int index = cursusNode.size() > CADET_INDEX ? CADET_INDEX : PISCINE_INDEX;

		JsonNode blackHoledAtNode = cursusNode.get(index).get("blackholed_at");
		if (blackHoledAtNode.isNull() || blackHoledAtNode.asText().isEmpty()) {
			return null;
		}
		return DateUtil.convertStringToDate(blackHoledAtNode.asText());
	}

	private Set<FtRole> handleInactiveUser(LocalDateTime blackHoledAt, Set<FtRole> roles) {
		if (blackHoledAt.isAfter(LocalDateTime.now())) {
			roles.add(FtRole.AGU);
		} else {
			roles.add(FtRole.INACTIVE);
		}
		return roles;
	}
}
