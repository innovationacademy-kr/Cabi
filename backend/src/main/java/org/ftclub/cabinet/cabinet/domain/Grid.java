package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Grid {

    @Column(name = "ROW")
    private Integer row;
    @Column(name = "COL")
    private Integer col;
}
