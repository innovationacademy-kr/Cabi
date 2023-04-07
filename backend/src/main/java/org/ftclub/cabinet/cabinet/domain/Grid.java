package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Grid {

    @Column(name = "row")
    private Integer row;
    @Column(name = "col")
    private Integer col;
}
