package org.ftclub.cabinet.cabinet.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "CABINET_PLACE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CabinetPlace {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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
}
