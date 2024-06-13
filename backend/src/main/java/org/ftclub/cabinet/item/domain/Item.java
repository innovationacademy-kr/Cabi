package org.ftclub.cabinet.item.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;

@Entity
@Table(name = "ITEM")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
public class Item {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	/**
	 * 상품 타입
	 */
	@Column(name = "Type", nullable = false)
	@Enumerated(value = EnumType.STRING)
	private ItemType type;

	/**
	 * 상품 고유 코드
	 */
	@Column(name = "SKU", unique = true, nullable = false)
	@Enumerated(value = EnumType.STRING)
	private Sku sku;

	/**
	 * 상품 가격
	 */
	@Column(name = "PRICE", nullable = false)
	private Long price;


	protected Item(long price, Sku sku, ItemType type) {
		this.price = price;
		this.sku = sku;
		this.type = type;
	}

	/**
	 * @param price 상품 가격
	 * @param sku   상품 코드
	 * @return 상품 객체	{@link Item}
	 */
	public static Item of(long price, Sku sku, ItemType type) {
		Item item = new Item(price, sku, type);
		if (!item.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return item;
	}

	/**
	 * name, sku, description 의 null 이 아닌지 확인합니다.
	 *
	 * @return 유효한 인스턴스 여부
	 */
	private boolean isValid() {
		return type.isValid() && type.isValid();
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof Item)) {
			return false;
		}
		return (this.id.equals(((Item) other).id));
	}
}
