package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.Validate;

@Embeddable
@NoArgsConstructor
@Getter
public class CabinetGrid {

    @Column(name = "HEIGHT")
    private Integer height;
    @Column(name = "WIDTH")
    private Integer width;

    public CabinetGrid(Integer height, Integer width) {
        Validate.notNull(height, "height must not be null");
        Validate.notNull(width, "width must not be null");
        this.height = height;
        this.width = width;
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof CabinetGrid)) {
            return false;
        }
        CabinetGrid otherCabinetGrid = (CabinetGrid) other;
        return height.equals(otherCabinetGrid.height) && width.equals(otherCabinetGrid.width);
    }
}
