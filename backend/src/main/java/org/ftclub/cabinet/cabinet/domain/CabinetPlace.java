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

@Entity
@Table(name = "CABINET_PLACE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CabinetPlace {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CABINET_PLACE_ID")
	private Long cabinetPlaceId;

	@Embedded
	private Location location;
	@Embedded
	private Grid grid;
	@Embedded
	private MapArea mapArea;

	protected CabinetPlace(Location location, Grid grid, MapArea mapArea) {
		this.location = location;
		this.grid = grid;
		this.mapArea = mapArea;
	}

	public static CabinetPlace of(Location location, Grid grid, MapArea mapArea) {
		return new CabinetPlace(location, grid, mapArea);
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
