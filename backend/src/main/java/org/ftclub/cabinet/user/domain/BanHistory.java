package org.ftclub.cabinet.user.domain;

import java.util.Date;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BAN_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class BanHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BAN_HISTORY_ID")
    private long banHistoryId;

    /*ban history에 cabinetId가 필요한 이유?*/
    @JoinColumn(name = "CABINET_ID", nullable = false)
    private Long cabinetId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "BANNED_AT", nullable = false)
    private Date bannedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UNBANNED_AT")
    private Date unbannedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "BAN_TYPE", length = 32, nullable = false)
    private BanType banType;

    @JoinColumn(name = "USER_ID", nullable = false)
    private Long userId;

    public BanHistory(Long cabinetId, Date bannedAt, Date unbannedAt,
            BanType banType, Long userId) {
        this.cabinetId = cabinetId;
        this.bannedAt = bannedAt;
        this.unbannedAt = unbannedAt;
        this.banType = banType;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BanHistory banHistory = (BanHistory) o;
        return Objects.equals(banHistoryId, banHistory.banHistoryId);
    }

    public boolean isBanEnd() {
        return new Date().before(unbannedAt);
    }
}
