package org.ftclub.cabinet.item.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.ToString;

@Entity
@Table(name = "ITEM")
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

}
