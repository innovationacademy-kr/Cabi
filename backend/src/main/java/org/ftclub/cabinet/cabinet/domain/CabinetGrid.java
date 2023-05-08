package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @deprecated
 */
@Embeddable
@NoArgsConstructor
@EqualsAndHashCode
@Getter
public class CabinetGrid {

	@Column(name = "HEIGHT")
	private Integer height;
	@Column(name = "WIDTH")
	private Integer width;

	protected CabinetGrid(Integer height, Integer width) {
		this.height = height;
		this.width = width;
	}

	public static CabinetGrid of(Integer height, Integer width) {
		return new CabinetGrid(height, width);
	}
}
