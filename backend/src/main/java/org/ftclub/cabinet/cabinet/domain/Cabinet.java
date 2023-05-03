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
import javax.persistence.UniqueConstraint;
import javax.persistence.Version;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.Validate;

@Entity
@Table(name = "CABINET", uniqueConstraints = {
        @UniqueConstraint(name = "unique_index", columnNames = {"CABINET_ID", "VERSION"})
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Cabinet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CABINET_ID")
    private Long cabinetId;

    @Version
    @Column(name = "VERSION")
    private Long version = 1L;

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

    @Column(name = "TITLE", length = 64)
    private String title;

    @Column(name = "MEMO", length = 64)
    private String memo;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "CABINET_PLACE_ID")
    private CabinetPlace cabinetPlace;

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

    public boolean isStatus(CabinetStatus cabinetStatus) {
        return this.status.equals(cabinetStatus);
    }

    public boolean isLentType(LentType lentType) {
        return this.lentType.equals(lentType);
    }

    public boolean isVisibleNum(Integer visibleNum) {
        return this.visibleNum.equals(visibleNum);
    }

    public boolean isCabinetPlace(CabinetPlace cabinetPlace) {
        return this.cabinetPlace.equals(cabinetPlace);
    }

    public void specifyCabinetPlace(CabinetPlace cabinetPlace) {
        this.cabinetPlace = cabinetPlace;
    }

    public void specifyStatus(CabinetStatus cabinetStatus) {
        this.status = cabinetStatus;
    }

    public void specifyStatusNote(String statusNote) {
        this.statusNote = statusNote;
    }

    public void specifyLentType(LentType lentType) {
        this.lentType = lentType;
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other) return true;
        if (!(other instanceof Cabinet)) return false;
        return this.cabinetId.equals(((Cabinet) other).cabinetId);
    }

    public void updateStatusByUserCount(Integer userCount) {
        if (userCount.equals(0)) {
            this.status = CabinetStatus.AVAILABLE;
            return;
        }
        if (userCount.equals(this.maxUser)) {
            this.status = CabinetStatus.FULL;
            return;
        }
        if (0 < userCount && userCount < this.maxUser) {
            if (this.status.equals(CabinetStatus.FULL)) {
                this.status = CabinetStatus.LIMITED_AVAILABLE;
            }
        }
    }
}
