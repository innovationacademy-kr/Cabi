package org.ftclub.cabinet.cabinet.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CABINET")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cabinet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CABINET_ID")
    private Long cabinetId;

    @Column(name = "VISIBLE_NUM")
    private Integer visibleNum;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "STATUS", length = 32, nullable = false)
    private CabinetStatus status;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "LENT_TYPE", length = 16, nullable = false)
    private LentType lentType;

    @Column(name = "MAX_USER", nullable = false)
    private Integer maxUser;

    @Column(name = "STATUS_NOTE", length = 64)
    private String statusNote;

    @Embedded Grid grid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CABINET_PLACE_ID")
    private CabinetPlace cabinetPlace;


    public Cabinet(Integer visibleNum, CabinetStatus status, LentType lentType, Integer maxUser,  Grid grid, CabinetPlace cabinetPlace) {
        this.visibleNum = visibleNum;
        this.status = status;
        this.lentType = lentType;
        this.maxUser = maxUser;
        this.grid = grid;
        this.cabinetPlace = cabinetPlace;
    }


}
