package org.ftclub.cabinet.item.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;

import javax.persistence.*;

@Entity
@Table(name = "ITEM")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Item {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	/**
	 * 상품명
	 */
	@Column(name = "NAME", unique = true, nullable = false)
	private String name;


	/**
	 * 상품 가격
	 */
	@Column(name = "PRICE", nullable = false)
	private Long price;

	/**
	 * 상품 고유 코드
	 */
	@Column(name = "SKU", unique = true, nullable = false)
	@Enumerated(value = EnumType.STRING)
	private Sku sku;

	/**
	 * 상품 설명
	 */
	@Column(name = "DESCRIPTION", nullable = false)
	private String description;

	protected Item(String name, long price, Sku sku, String description) {
		this.name = name;
		this.price = price;
		this.sku = sku;
		this.description = description;
	}

	/**
	 * @param name        상품 이름
	 * @param price       상품 가격
	 * @param sku         상품 코드
	 * @param description 상품 설명
	 * @return 상품 객체	{@link Item}
	 */
	public static Item of(String name, long price, Sku sku, String description) {
		Item item = new Item(name, price, sku, description);
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
		return this.name != null && this.description != null && sku.isValid();
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
