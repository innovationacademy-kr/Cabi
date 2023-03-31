package org.ftclub.cabinet.cabinet.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CabinetPlace {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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
}
