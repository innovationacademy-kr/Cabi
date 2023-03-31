package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class MapArea {
    @Column(name = "start_x")
    private Integer startX;
    @Column(name = "end_x")
    private Integer endX;
    @Column(name = "start_y")
    private Integer startY;
    @Column(name = "end_y")
    private Integer endY;
}
