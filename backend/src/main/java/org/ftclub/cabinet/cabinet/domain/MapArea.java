package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
@Getter
public class MapArea {
    @Column(name = "START_X")
    private Integer startX;

    @Column(name = "END_X")
    private Integer endX;

    @Column(name = "START_Y")
    private Integer startY;

    @Column(name = "END_Y")
    private Integer endY;
}
