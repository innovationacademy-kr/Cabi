package org.ftclub.cabinet.item.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.ExceptionStatus;

@Entity
@Table(name = "ITEM")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString()
public class Item {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", unique = true, nullable = false)
	private String name;

	@Column(name = "PRICE", nullable = false)
	private Long price;

	@Column(name = "SKU", unique = true, nullable = false)
	private Long sku;

	@Column(name = "DESCRIPTION", nullable = false)
	private String description;

	protected Item(String name, long price, long sku, String description){
		this.name = name;
		this.price = price;
		this.sku = sku;
		this.description = description;
	}

	public static Item of(String name, long price, long sku, String description){
		Item item = new Item(name, price, sku, description);
		if (!item.isValid()){
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return item;
	}

	private boolean isValid() {
		return this.name != null && this.sku != null && this.description != null;
	}
}
