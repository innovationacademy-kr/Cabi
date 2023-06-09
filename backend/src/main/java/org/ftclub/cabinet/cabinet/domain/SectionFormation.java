package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

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

	private boolean isValid() {
		return (this.width > 0 && this.height > 0);
	}

	public static SectionFormation of(Integer width, Integer height) {
		SectionFormation sectionFormation = new SectionFormation(width, height);
		ExceptionUtil.throwIfFalse(sectionFormation.isValid(), new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return sectionFormation;
	}

}
