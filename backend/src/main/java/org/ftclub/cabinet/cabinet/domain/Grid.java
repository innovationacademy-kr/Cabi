package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사물함이 실제로 구역에서 위치한 행과 열입니다.
 */
@Embeddable
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Grid {

	@Column(name = "ROW")
	private Integer row;
	@Column(name = "COL")
	private Integer col;

	public boolean isValid() {
		return (this.row > 0 && this.col > 0);
	}

	public static Grid of(Integer row, Integer col) {
		return new Grid(row, col);
	}
}
