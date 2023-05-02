package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AccessLevel;
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
    private CabinetGrid cabinetGrid;
    @Embedded
    private MapArea mapArea;

    public CabinetPlace(Location location, CabinetGrid cabinetGrid, MapArea mapArea) {
        this.location = location;
        this.cabinetGrid = cabinetGrid;
        this.mapArea = mapArea;
    }

}
