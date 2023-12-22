package org.ftclub.cabinet.admin.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * 관리자 엔티티 클래스입니다.
 */
@Entity
@Table(name = "ADMIN")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Log4j2
public class Admin {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ADMIN_ID")
	private Long adminId;

	/**
	 * OAuth 방식을 사용하기 때문에 비밀번호 없이 이메일만 저장합니다.
	 */
	@NotNull
	@Email
	@Column(name = "EMAIL", length = 128, unique = true, nullable = false)
	private String email;

	/**
	 * {@link AdminRole}
	 */
	@Enumerated(value = EnumType.STRING)
	@Column(name = "ROLE", length = 16, nullable = false)
	private AdminRole role = AdminRole.NONE;

	protected Admin(String email, AdminRole role) {
		this.email = email;
		this.role = role;
	}

	public static Admin of(String email, AdminRole role) {
		Admin admin = new Admin(email, role);
		ExceptionUtil.throwIfFalse(admin.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return admin;
	}

	private boolean isValid() {
		return role != null && role.isValid() && email != null &&
				Pattern.matches(
						"^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\\.[A-Za-z0-9\\-]+\\.*[A-Za-z0-9\\-]*",
						email);
	}

	@Override
	public boolean equals(final Object other) {
		if (other == this) {
			return true;
		}
		if (!(other instanceof Admin)) {
			return false;
		}
		Admin admin = (Admin) other;
		return Objects.equals(adminId, admin.adminId);
	}

	public void changeAdminRole(AdminRole role) {
		log.info("Called changedAdminRole - role from {} to {}", this.role, role);
		this.role = role;
		ExceptionUtil.throwIfFalse(this.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
	}
}
