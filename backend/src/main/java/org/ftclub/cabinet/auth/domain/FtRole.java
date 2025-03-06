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
	USER,
	CADET,
	MEMBER,
	STAFF,
	AGU,

	PISCINER,

	INACTIVE,
	BLACK_HOLE;


	public static final String DELIMITER = ",";
	public static final String ROLE = "ROLE_";
	/**
	 * 본 과정 이상의 사용자인지 확인합니다.
	 * <p>
	 * 본 과정이면서도 STAFF인 케이스가 있으므로 STAFF도 포함합니다.
	 *
	 * @return 본 과정 이상의 사용자인지 여부
	 */

	/**
	 * enum name 들을 합쳐 String으로 반환
	 *
	 * @param roles
	 * @return
	 */
	public static String combineRolesToString(List<FtRole> roles) {
		return roles.stream()
				.map(FtRole::name)
				.collect(Collectors.joining(DELIMITER));
	}

	public static boolean isInActive(List<FtRole> roles) {
		return roles.contains(BLACK_HOLE) || roles.contains(INACTIVE);
	}

	public boolean isInCursus() {
		return this == CADET || this == MEMBER || this == STAFF || this == USER || this == AGU;
	}

	public String getAuthority() {
		return ROLE + name();
	}
}
