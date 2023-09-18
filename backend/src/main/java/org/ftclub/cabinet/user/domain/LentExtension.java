package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;

@Entity
@Table(name = "LENT_EXTENSION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
@Log4j2
public class LentExtension {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "LENT_EXTENSION_ID")
	private Long lentExtensionId;

	@Column(name = "name", nullable = false)
	private String name;
	@Column(name = "extension_period", nullable = false)
	private int extensionPeriod;
	@Column(name = "expired_at", nullable = false)
	private LocalDateTime expiredAt;
	@Column(name = "type")
	private LentExtensionType lentExtensionType;

	@JoinColumn(name = "USER_ID", insertable = false, updatable = false)
	@ManyToOne(fetch = FetchType.LAZY)
	private User user;

	@NotNull
	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	protected LentExtension(String name, int extensionPeriod, LocalDateTime expiredAt,
			LentExtensionType lentExtensionType, Long userId) {
		this.name = name;
		this.extensionPeriod = extensionPeriod;
		this.expiredAt = expiredAt;
		this.lentExtensionType = lentExtensionType;
		this.userId = userId;
	}

	public static LentExtension of(String name, int extensionPeriod, LocalDateTime expiredAt,
			LentExtensionType lentExtensionType, Long userId) {
		LentExtension lentExtension = new LentExtension(name, extensionPeriod, expiredAt,
				lentExtensionType, userId);
		return lentExtension;
	}
}
