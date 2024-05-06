package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

/**
 * 건물, 층, 구역에 대한 정보입니다.
 */
@Embeddable
@NoArgsConstructor
@EqualsAndHashCode
@Getter
@ToString
public class Location {

	@Column(name = "BUILDING")
	private String building;
	@Column(name = "FLOOR")
	private Integer floor;
	@Column(name = "SECTION")
	private String section;

	protected Location(String building, Integer floor, String section) {
		this.building = building;
		this.floor = floor;
		this.section = section;
	}

	public static Location of(String building, Integer floor, String section) {
		Location location = new Location(building, floor, section);
		ExceptionUtil.throwIfFalse(location.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return location;
	}

	private boolean isValid() {
		return (this.building != null && this.floor > 0 && this.section != null);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		Location location = (Location) obj;
		return building.equals(location.building) && floor.equals(location.floor)
				&& section.equals(location.section);
	}

	@Override
	public int hashCode() {
		int hash = 17 * 31 + building.hashCode();
		hash = 31 * hash + floor.hashCode();
		hash = 31 * hash + section.hashCode();
		return hash;
	}
}
