package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Location {
    private String building;
    private Integer floor;
    private String section;
}
