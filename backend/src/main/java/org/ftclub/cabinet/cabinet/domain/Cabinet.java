package org.ftclub.cabinet.cabinet.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cabinet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cabinetId;

    private Integer visibleNum;

    @Enumerated(value = EnumType.STRING)
    private CabinetStatus status;

    @Enumerated(value = EnumType.STRING)
    private LentType lentType;

    private Integer maxUser;

    private String statusNote;

    @Embedded Grid grid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabinet_place_id")
    private CabinetPlace cabinetPlace;

    @OneToMany(mappedBy = "cabinet", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LentHistory> lentHistoryList = new ArrayList<>();

    public Cabinet(Integer visibleNum, CabinetStatus status, LentType lentType, Integer maxUser,  Grid grid, CabinetPlace cabinetPlace) {
        this.visibleNum = visibleNum;
        this.status = status;
        this.lentType = lentType;
        this.maxUser = maxUser;
        this.grid = grid;
        this.cabinetPlace = cabinetPlace;
    }
}
