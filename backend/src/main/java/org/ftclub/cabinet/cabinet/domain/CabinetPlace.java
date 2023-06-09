package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

/**
 * 사물함들이 위치하는 구역에 대한 엔티티입니다.
 */
@Entity
@Table(name = "CABINET_PLACE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CabinetPlace {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CABINET_PLACE_ID")
	private Long cabinetPlaceId;

	/**
	 * {@link Location}
	 */
	@Embedded
	private Location location;
	
	/**
	 * {@link SectionFormation}
	 */
	@Embedded
	private SectionFormation sectionFormation;

	/**
	 * {@link MapArea}
	 */
	@Embedded
	private MapArea mapArea;

	protected CabinetPlace(Location location, SectionFormation sectionFormation, MapArea mapArea) {
		this.location = location;
		this.sectionFormation = sectionFormation;
		this.mapArea = mapArea;
	}

	public static CabinetPlace of(Location location, SectionFormation sectionFormation,
			MapArea mapArea) {
		CabinetPlace cabinetPlace = new CabinetPlace(location, sectionFormation, mapArea);
		ExceptionUtil.throwIfInvalid(cabinetPlace.isValid(), new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return cabinetPlace;
	}

	private boolean isValid() {
		return (this.location != null && this.sectionFormation != null && this.mapArea != null);
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof CabinetPlace)) {
			return false;
		}
		return this.cabinetPlaceId.equals(((CabinetPlace) other).cabinetPlaceId);
	}
}
