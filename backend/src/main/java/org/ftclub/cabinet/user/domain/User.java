package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.regex.Pattern;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

@Entity
@Table(name = "USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "USER_ID")
	private Long userId;

	@NotNull
	@Column(name = "NAME", length = 32, unique = true, nullable = false)
	private String name;

	@Email
	@Column(name = "EMAIL", unique = true)
	private String email;

	@Column(name = "BLACKHOLED_AT")
	private LocalDateTime blackholedAt = null;

	@Column(name = "DELETED_AT", length = 32)
	private LocalDateTime deletedAt = null;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "ROLE", length = 32, nullable = false)
	private UserRole role;

	private boolean isValid() {
		return name != null && email != null && Pattern.matches(
				"^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\\.[A-Za-z0-9\\-]+\\.*[A-Za-z0-9\\-]*", email)
				&& role != null && role.isValid();
	}

	protected User(String name, String email, LocalDateTime blackholedAt, UserRole userRole) {
		this.name = name;
		this.email = email;
		this.blackholedAt = blackholedAt;
		this.role = userRole;
	}

	public static User of(String name, String email, LocalDateTime blackholedAt,
			UserRole userRole) {
		User user = new User(name, email, blackholedAt, userRole);
		ExceptionUtil.throwIfFalse(user.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return user;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		User user = (User) o;
		return Objects.equals(userId, user.userId);
	}

	public boolean isUserRole(UserRole role) {
		return role.equals(this.role);
	}

	public void changeBlackholedAt(LocalDateTime blackholedAt) {
		this.blackholedAt = blackholedAt;
	}

	public void setDeletedAt(LocalDateTime deletedAt) {
		this.deletedAt = deletedAt;
	}
}