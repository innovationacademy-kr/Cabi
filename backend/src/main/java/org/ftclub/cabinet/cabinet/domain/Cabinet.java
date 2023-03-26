package org.ftclub.cabinet.cabinet.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Access(value = AccessType.PROPERTY)
@Table(name = "cabinet")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cabinet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cabinet_id")
    private Long cabinetId;

    @Column(name = "visible_num")
    private Integer visibleNum;

    @Column(name = "status")
    @Enumerated(value = EnumType.STRING)
    private CabinetStatus status;

    @Column(name = "lent_type")
    @Enumerated(value = EnumType.STRING)
    private LentType lentType;

    @Column(name = "max_user")
    private Integer maxUser;

    @Column(name = "status_note", length = 64)
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
