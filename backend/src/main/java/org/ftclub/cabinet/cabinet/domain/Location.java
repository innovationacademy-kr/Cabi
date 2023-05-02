package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Location {

    @Column(name = "BUILDING")
    private String building;
    @Column(name = "FLOOR")
    private Integer floor;
    @Column(name = "SECTION")
    private String section;

    public Location(String building, Integer floor, String section) {
        this.building = building;
        this.floor = floor;
        this.section = section;
    }

    public Location() {
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Location)) {
            return false;
        }
        Location otherLocation = (Location) other;
        return building.equals(otherLocation.building) && floor.equals(otherLocation.floor)
                && section.equals(otherLocation.section);
    }
}
