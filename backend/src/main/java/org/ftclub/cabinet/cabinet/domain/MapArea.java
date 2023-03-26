package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Embeddable;

@Embeddable
public class MapArea {
    private Integer startX;
    private Integer endX;
    private Integer startY;
    private Integer endY;
}
