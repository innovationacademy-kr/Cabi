package org.ftclub.cabinet.user.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.utils.entity.IdentityKeyEntity;

/**
 * 관리자 엔티티 클래스입니다.
 */
@Entity
@Table(name = "ADMIN_USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class AdminUser extends IdentityKeyEntity {

	/**
	 * OAuth 방식을 사용하기 때문에 비밀번호 없이 이메일만 저장합니다.
	 */
	@Column(name = "EMAIL", length = 128, unique = true, nullable = false)
	private String email;

	/**
	 * {@link AdminRole}
	 */
	@Enumerated(value = EnumType.STRING)
	@Column(name = "ROLE", length = 16, nullable = false)
	private AdminRole role = AdminRole.NONE;

	protected AdminUser(String email, AdminRole role) {
		this.email = email;
		this.role = role;
	}

	public static AdminUser of(String email, AdminRole role) {
		return new AdminUser(email, role);
	}

	public void changeAdminRole(AdminRole role) {
		this.role = role;
	}
}
