package org.ftclub.cabinet.item.domain;

import static javax.persistence.FetchType.LAZY;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.data.annotation.CreatedDate;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "ITEM_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString()
@EntityListeners(AuditingEntityListener.class)
public class ItemHistory {

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@CreatedDate
	@Column(name = "PURCHASE_AT", nullable = false, updatable = false)
	private LocalDateTime purchaseAt;

	@Column(name = "USED_AT")
	private LocalDateTime usedAt;

	@JoinColumn(name = "USER", nullable = false)
	@ManyToOne(fetch = LAZY)
	private User user;

	@JoinColumn(name = "ITEM_ID", nullable = false)
	@ManyToOne(fetch = LAZY)
	private Item item;

	@Column(name = "ITEM_ID", nullable = false, updatable = false, insertable = false)
	private Long itemId;

	@Column(name = "USER_ID", nullable = false, updatable = false, insertable = false)
	private Long userId;


	protected ItemHistory(long userId, long itemId, LocalDateTime usedAt) {
		this.userId = userId;
		this.itemId = itemId;
		this.usedAt = usedAt;
	}

	public static ItemHistory of(long userId, long itemId, LocalDateTime usedAt) {
		ItemHistory itemHistory = new ItemHistory(userId, itemId, usedAt);
		if (!itemHistory.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return itemHistory;
	}

	private boolean isValid() {
		return this.userId != null && this.itemId != null && this.purchaseAt != null;
	}

}
