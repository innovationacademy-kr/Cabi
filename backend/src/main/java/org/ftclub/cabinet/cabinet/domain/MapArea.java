package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.Validate;

@Embeddable
@NoArgsConstructor
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

    public MapArea(Integer startX, Integer endX, Integer startY, Integer endY) {
        Validate.notNull(startX, "startX must not be null");
        Validate.notNull(endX, "endX must not be null");
        Validate.notNull(startY, "startY must not be null");
        Validate.notNull(endY, "endY must not be null");
        this.startX = startX;
        this.endX = endX;
        this.startY = startY;
        this.endY = endY;
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof MapArea)) {
            return false;
        }
        MapArea otherMapArea = (MapArea) other;
        return startX.equals(otherMapArea.startX)
                && endX.equals(otherMapArea.endX)
                && startY.equals(otherMapArea.startY)
                && endY.equals(otherMapArea.endY);
    }
}
