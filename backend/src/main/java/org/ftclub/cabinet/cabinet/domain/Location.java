package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.Validate;

@Embeddable
@NoArgsConstructor
@Getter
public class Location {

    @Column(name = "BUILDING")
    private String building;
    @Column(name = "FLOOR")
    private Integer floor;
    @Column(name = "SECTION")
    private String section;

    public Location(String building, Integer floor, String section) {
        Validate.notNull(building, "building must not be null");
        Validate.notNull(floor, "floor must not be null");
        Validate.notNull(section, "section must not be null");
        this.building = building;
        this.floor = floor;
        this.section = section;
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
