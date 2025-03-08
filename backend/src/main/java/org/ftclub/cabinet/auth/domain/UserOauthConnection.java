package org.ftclub.cabinet.auth.domain;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserOauthConnection {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID")
	private User user;
	@Column(name = "PROVIDER_TYPE")
	private String providerType; // google, ft
	@Column(name = "PROVIDER_ID")
	private String providerId; // UUID
	@Column(name = "CREATED_AT")
	private LocalDateTime createdAt;
	@Email
	@Column(name = "EMAIL")
	private String email;

	protected UserOauthConnection(User user, String providerType, String providerId, String email) {
		this.user = user;
		this.providerType = providerType;
		this.providerId = providerId;
		this.email = email;
		this.createdAt = LocalDateTime.now();
	}

	public static UserOauthConnection of(
			User user,
			String providerType,
			String providerId,
			String mail) {

		UserOauthConnection connection =
				new UserOauthConnection(user, providerType, providerId, mail);
		if (!connection.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return connection;
	}

	private boolean isValid() {
		return this.user != null
				&& this.email != null && this.createdAt != null
				&& this.providerId != null && this.providerType != null;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (!(o instanceof UserOauthConnection)) {
			return false;
		}
		UserOauthConnection that = (UserOauthConnection) o;
		return Objects.equals(getId(), that.getId());
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(getId());
	}
}
