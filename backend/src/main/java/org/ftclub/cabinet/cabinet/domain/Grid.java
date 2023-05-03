package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.EqualsAndHashCode;
import lombok.Getter;

@Embeddable
@Getter
public class Grid {

    @Column(name = "ROW")
    private Integer row;
    @Column(name = "COL")
    private Integer col;
}
