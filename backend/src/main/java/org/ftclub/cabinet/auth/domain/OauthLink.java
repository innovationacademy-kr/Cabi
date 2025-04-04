package org.ftclub.cabinet.auth.domain;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.regex.Pattern;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.User;

@Entity
@Getter
@ToString
@Logging(level = LogLevel.DEBUG)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OauthLink {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "USER_ID")
	private User user;
	@Column(name = "PROVIDER_TYPE", nullable = false)
	private String providerType; // google, ft
	@Column(name = "PROVIDER_ID", nullable = false)
	private String providerId; // UUID
	@Column(name = "CREATED_AT", nullable = false)
	private LocalDateTime createdAt;
	@Column(name = "DELETED_AT")
	private LocalDateTime deletedAt;
	@Column(name = "EMAIL", nullable = false)
	private String email;

	protected OauthLink(User user, String providerType, String providerId, String email) {
		this.user = user;
		this.providerType = providerType;
		this.providerId = providerId;
		this.email = email;
		this.createdAt = LocalDateTime.now();
		this.deletedAt = null;
	}

	public static OauthLink of(
			User user,
			String providerType,
			String providerId,
			String mail) {

		OauthLink connection =
				new OauthLink(user, providerType, providerId, mail);
		if (!connection.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return connection;
	}

	private boolean isValid() {
		return this.user != null && this.email != null && this.createdAt != null
				&& this.providerId != null && this.providerType != null
				&& (this.providerType.equals("github") || isValidEmail(this.email));
	}

	private boolean isValidEmail(String email) {
		String emailRegex = "^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\\.[A-Za-z0-9\\-]+\\.*[A-Za-z0-9\\-]*$";
		return Pattern.matches(emailRegex, email);
	}

	public void generateDeletedAt() {
		this.deletedAt = LocalDateTime.now();
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (!(o instanceof OauthLink)) {
			return false;
		}
		OauthLink that = (OauthLink) o;
		return Objects.equals(getId(), that.getId());
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(getId());
	}
}
