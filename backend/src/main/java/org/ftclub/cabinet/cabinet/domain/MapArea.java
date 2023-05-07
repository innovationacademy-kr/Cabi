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
public class MapArea {

	@Column(name = "START_X")
	private Integer startX;

	@Column(name = "END_X")
	private Integer endX;

	@Column(name = "START_Y")
	private Integer startY;

	@Column(name = "END_Y")
	private Integer endY;

	protected MapArea(Integer startX, Integer endX, Integer startY, Integer endY) {
		this.startX = startX;
		this.endX = endX;
		this.startY = startY;
		this.endY = endY;
	}

	public MapArea of(Integer startX, Integer endX, Integer startY, Integer endY) {
		return new MapArea(startX, endX, startY, endY);
	}
}
