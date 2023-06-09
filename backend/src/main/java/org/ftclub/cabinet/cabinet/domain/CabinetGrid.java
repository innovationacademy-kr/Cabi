package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

	private boolean isValid() {
		return (this.height > 0 && this.width > 0);
	}

	public static CabinetGrid of(Integer height, Integer width) {
		return new CabinetGrid(height, width);
	}
}
