package org.ftclub.cabinet.item.domain;
import static javax.persistence.FetchType.LAZY;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
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

@Entity
@Table(name = "ITEM_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString()
public class ItemHistory {

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy =  GenerationType.IDENTITY)
	private long id;

	@JoinColumn(name = "USER", nullable = false)
	@ManyToOne(fetch = LAZY)
	private User user;

	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	@CreatedDate
	@Column(name = "PURCHASE_AT", nullable = false, updatable = false)
	private LocalDateTime purchaseAt;

	@Column(name = "USED_AT")
	private LocalDateTime usedAt;

	protected ItemHistory (long userId, LocalDateTime purchaseAt, LocalDateTime usedAt){
		this.userId = userId;
		this.purchaseAt = purchaseAt;
		this.usedAt = usedAt;
	}

	public static ItemHistory of(long userId, LocalDateTime purchaseAt, LocalDateTime usedAt){
		ItemHistory itemHistory = new ItemHistory(userId, purchaseAt, usedAt);
		if (!itemHistory.isValid()){
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return itemHistory;
	}

	private boolean isValid() {
		return this.userId != null && this.purchaseAt != null;
	}

}
