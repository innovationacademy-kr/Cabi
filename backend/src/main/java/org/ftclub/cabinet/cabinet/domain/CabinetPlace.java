package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.utils.entity.IdentityKeyEntity;

/**
 * 사물함들이 위치하는 구역에 대한 엔티티입니다.
 */
@Entity
@Table(name = "CABINET_PLACE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CabinetPlace extends IdentityKeyEntity {

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
		return new CabinetPlace(location, sectionFormation, mapArea);
	}
}
