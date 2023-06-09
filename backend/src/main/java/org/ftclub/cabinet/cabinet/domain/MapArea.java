package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

/**
 * 서비스의 지도에서 나타내지는 영역의 좌표 값들입니다.
 */
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

	private boolean isValid() {
		return (this.startX > 0 && this.endX > 0 && this.startY > 0 && this.endY > 0);
	}

	public static MapArea of(Integer startX, Integer endX, Integer startY, Integer endY) {
		MapArea mapArea = new MapArea(startX, endX, startY, endY);
		ExceptionUtil.throwIfFalse(mapArea.isValid(), new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return mapArea;
	}


}
