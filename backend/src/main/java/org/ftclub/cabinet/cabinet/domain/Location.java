package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class Location {

    @Column(name = "BUILDING")
    private String building;
    @Column(name = "FLOOR")
    private Integer floor;
    @Column(name = "SECTION")
    private String section;
}
