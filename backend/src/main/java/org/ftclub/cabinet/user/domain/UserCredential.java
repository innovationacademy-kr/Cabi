package org.ftclub.cabinet.user.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCredential {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	@Email
	@Column(name = "EMAIL", unique = true, nullable = false)
	private String email;
	@Column(name = "PROVIDER")
	private String provider;
	@Column(name = "OAUTHID", unique = true)
	private String oauthId;

	protected UserCredential(String provider, String oauthId, String email) {
		this.provider = provider;
		this.oauthId = oauthId;
		this.email = email;
	}

	public static UserCredential of(String provider, String oauthId, String email) {
		return new UserCredential(provider, oauthId, email);
	}
}
