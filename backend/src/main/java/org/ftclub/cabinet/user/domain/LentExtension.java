package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.ExceptionStatus;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "LENT_EXTENSION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
@Log4j2
public class LentExtension {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "name", nullable = false)
	private String name;
	@Column(name = "extension_period", nullable = false)
	private int extensionPeriod;
	@Column(name = "expired_at", nullable = false)
	private LocalDateTime expiredAt;
	@Enumerated(value = EnumType.STRING)
	@Column(name = "type", nullable = false)
	private LentExtensionType lentExtensionType;
	@Column(name = "used_at")
	private LocalDateTime usedAt;

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
		if (!lentExtension.isValid()) {
			throw ExceptionStatus.INVALID_STATUS.asServiceException();
		}
		return lentExtension;
	}

	private boolean isValid() {
		return name != null && extensionPeriod > 0 && expiredAt != null &&
				lentExtensionType != null && userId != null;
	}

	public void use() {
		this.usedAt = LocalDateTime.now();
	}

	public int compareTo(LentExtension lentExtension) {
		return this.expiredAt.compareTo(lentExtension.expiredAt);
	}


	public boolean isExpiredBefore(LocalDateTime at) {
		return this.expiredAt.isBefore(at);
	}

	public boolean isUsed() {
		return this.usedAt != null;
	}
}
