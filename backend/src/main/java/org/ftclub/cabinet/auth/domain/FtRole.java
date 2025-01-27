package org.ftclub.cabinet.auth.domain;

import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 42 API에서 제공하는 사용자의 역할을 나타내는 열거 타입입니다.
 */
@Getter
@RequiredArgsConstructor
public enum FtRole {
	STAFF("ROLE_STAFF"),
	CADET("ROLE_CADET"),
	MEMBER("ROLE_MEMBER"),
	INACTIVE("ROLE_INACTIVE"),
	AGU("ROLE_AGU"),
	USER("ROLE_USER"),
	PISCINER("ROLE_PISCINER"),
	TEMP_USER("ROLE_TEMP"),
	;


	public static final String DELIMITER = ",";
	public static final String ROLE = "ROLE_";
	/**
	 * 본 과정 이상의 사용자인지 확인합니다.
	 * <p>
	 * 본 과정이면서도 STAFF인 케이스가 있으므로 STAFF도 포함합니다.
	 *
	 * @return 본 과정 이상의 사용자인지 여부
	 */
	private final String roles;

	public static String addRole(FtRole role, String addRole) {
		String preRoles = role.getRoles();
		return preRoles + DELIMITER + addRole;
	}

	public static String addRole(String roles, FtRole role) {
		return roles + DELIMITER + role.getRoles();
	}

	/**
	 * enum name 들을 합쳐 String으로 반환
	 *
	 * @param roles
	 * @return
	 */
	public static String combineRolesToSTring(List<FtRole> roles) {
		return roles.stream()
				.map(FtRole::name)
				.collect(Collectors.joining(DELIMITER));
	}

	public boolean isInCursus() {
		return this == CADET || this == MEMBER || this == STAFF || this == USER;
	}

	public String getAuthority() {
		return "ROLE_" + name();
	}
}
