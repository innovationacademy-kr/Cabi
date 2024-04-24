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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "ITEM_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = {"user", "item"})
@EntityListeners(AuditingEntityListener.class)
@Getter
public class ItemHistory {

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	/**
	 * 아이템 구매 일자
	 */
	@CreatedDate
	@Column(name = "PURCHASE_AT", nullable = false, updatable = false)
	private LocalDateTime purchaseAt;

	/**
	 * 아이템 사용 일자
	 */
	@Column(name = "USED_AT")
	private LocalDateTime usedAt;

	/**
	 * 아이템 소유자
	 */
	@JoinColumn(name = "USER_ID", nullable = false, updatable = false, insertable = false)
	@ManyToOne(fetch = LAZY)
	private User user;

	/**
	 * 사용한 아이템
	 */
	@JoinColumn(name = "ITEM_ID", nullable = false, updatable = false, insertable = false)
	@ManyToOne(fetch = LAZY)
	private Item item;

	/**
	 * 사용한 아이템 ID
	 */
	@Column(name = "ITEM_ID", nullable = false)
	private Long itemId;

	/**
	 * 사용한 사용자 ID
	 */
	@Column(name = "USER_ID", nullable = false)
	private Long userId;


	protected ItemHistory(long userId, long itemId, LocalDateTime usedAt) {
		this.userId = userId;
		this.itemId = itemId;
		this.usedAt = usedAt;
	}

	/**
	 * @param userId 아이템을 사용한 유저 ID
	 * @param itemId 사용된 아이템 ID
	 * @param usedAt 아이템 사용일자
	 * @return 아이템 히스토리 객체 {@link ItemHistory}
	 */
	public static ItemHistory of(long userId, long itemId, LocalDateTime usedAt) {
		ItemHistory itemHistory = new ItemHistory(userId, itemId, usedAt);
		if (!itemHistory.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return itemHistory;
	}

	/**
	 * 사용자 ID, 아이템 ID, 사용일자의 null 이 아닌지 확인합니다.
	 *
	 * @return 유효한 인스턴스 여부
	 */
	private boolean isValid() {
		return this.userId != null && this.itemId != null;
	}

}
