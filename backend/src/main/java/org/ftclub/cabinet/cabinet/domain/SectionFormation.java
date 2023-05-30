package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 섹션을 구성하는 사물함들의 가로 x 세로에 대한 데이터입니다.
 */
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Getter
public class SectionFormation {

	@Column(name = "WIDTH")
	private Integer width;

	@Column(name = "HEIGHT")
	private Integer height;

	public static SectionFormation of(Integer width, Integer height) {
		return new SectionFormation(width, height);
	}

}
