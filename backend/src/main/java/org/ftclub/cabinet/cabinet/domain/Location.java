package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.Validate;

@Embeddable
@NoArgsConstructor
@EqualsAndHashCode
@Getter
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
}
