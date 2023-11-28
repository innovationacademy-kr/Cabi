package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.DomainException;
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
	@Column(name = "LENT_EXTENSION_ID")
	private Long lentExtensionId;

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
	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

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
		this.deletedAt = null;
	}

	public static LentExtension of(String name, int extensionPeriod, LocalDateTime expiredAt,
	                               LentExtensionType lentExtensionType, Long userId) {
		LentExtension lentExtension = new LentExtension(name, extensionPeriod, expiredAt,
				lentExtensionType, userId);
		if (!lentExtension.isValid()) {
			throw new DomainException(ExceptionStatus.INVALID_STATUS);
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

	public void delete(LocalDateTime at) {
		this.deletedAt = at;
	}
}
