package org.ftclub.cabinet.cabinet.domain;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CABINET")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Cabinet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Embedded
    Grid grid;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "CABINET_PLACE_ID")
    private CabinetPlace cabinetPlace;

    @Column(name = "TITLE", length = 64)
    private String title;

    @Column(name = "MEMO", length = 64)
    private String memo;


    public Cabinet(Integer visibleNum, CabinetStatus status, LentType lentType, Integer maxUser,
            Grid grid, CabinetPlace cabinetPlace) {
        this.visibleNum = visibleNum;
        this.status = status;
        this.lentType = lentType;
        this.maxUser = maxUser;
        this.grid = grid;
        this.cabinetPlace = cabinetPlace;
        this.title = "";
        this.memo = "";
    }
}
