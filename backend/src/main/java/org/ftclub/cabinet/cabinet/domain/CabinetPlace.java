package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.Validate;

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
    private CabinetGrid cabinetGrid;
    @Embedded
    private MapArea mapArea;

    public CabinetPlace(Location location, CabinetGrid cabinetGrid, MapArea mapArea) {
        this.location = location;
        this.cabinetGrid = cabinetGrid;
        this.mapArea = mapArea;
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other) return true;
        if (!(other instanceof CabinetPlace)) return false;
        return this.cabinetPlaceId.equals(((CabinetPlace) other).cabinetPlaceId);
    }
}
