package org.ftclub.cabinet.cabinet.domain;

import java.util.ArrayList;
import java.util.List;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.lent.domain.LentHistory;

@Entity
@Table(name = "CABINET")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CABINET_PLACE_ID")
    private CabinetPlace cabinetPlace;

    @OneToMany(mappedBy = "cabinet", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LentHistory> lentHistoryList = new ArrayList<>();

    public Cabinet(Integer visibleNum, CabinetStatus status, LentType lentType, Integer maxUser,
            Grid grid, CabinetPlace cabinetPlace) {
        this.visibleNum = visibleNum;
        this.status = status;
        this.lentType = lentType;
        this.maxUser = maxUser;
        this.grid = grid;
        this.cabinetPlace = cabinetPlace;
    }

    public Long cabinetId() {
        return cabinetId;
    }

    public Integer visibleNum() {
        return visibleNum;
    }

    public CabinetStatus status() {
        return status;
    }

    public LentType lentType() {
        return lentType;
    }

    public Integer maxUser() {
        return maxUser;
    }

    public String statusNote() {
        return statusNote;
    }

    public Grid grid() {
        return grid;
    }

    public CabinetPlace cabinetPlace() {
        return cabinetPlace;
    }

    public boolean isStatus(CabinetStatus cabinetStatus) {
        Validate.notNull(cabinetStatus, "CabinetStatus is required");
        return this.status == cabinetStatus;
    }

    public boolean isLentType(LentType lentType) {
        Validate.notNull(lentType, "LentType is required");
        return this.lentType == lentType;
    }

    public boolean isVisibleNum(Integer visibleNum) {
        Validate.notNull(visibleNum, "VisibleNum is required");
        return this.visibleNum == visibleNum;
    }

    public boolean isCabinetPlace(CabinetPlace cabinetPlace) {
        Validate.notNull(cabinetPlace, "CabinetPlace is required");
        return this.cabinetPlace == cabinetPlace;
    }

    public void specifyCabinetPlace(CabinetPlace cabinetPlace) {
        Validate.notNull(cabinetPlace, "CabinetPlace is required");
        this.cabinetPlace = cabinetPlace;
    }

    public void specifyStatus(CabinetStatus cabinetStatus) {
        Validate.notNull(cabinetStatus, "CabinetStatus is required");
        this.status = cabinetStatus;
    }

    public void specifyStatusNote(String statusNote) {
        Validate.notNull(statusNote, "StatusNote is required");
        this.statusNote = statusNote;
    }

    public void specifyLentType(LentType lentType) {
        Validate.notNull(lentType, "LentType is required");
        this.lentType = lentType;
    }

    public boolean sameIdentityAs(final Cabinet other) {
        return other != null && this.cabinetId.equals(other.cabinetId);
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Cabinet)) {
            return false;
        }
        return sameIdentityAs((Cabinet) other);
    }
}
