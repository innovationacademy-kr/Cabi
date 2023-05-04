package org.ftclub.cabinet.user.domain;

import java.util.Date;
import java.util.Objects;
import javax.persistence.Column;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;

@Entity
@Table(name = "BAN_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class BanHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BAN_HISTORY_ID")
    private long banHistoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CABINET_ID", nullable = false)
    private Cabinet cabinet;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "BANNED_AT", nullable = false)
    private Date bannedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UNBANNED_AT")
    private Date unbannedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "BAN_TYPE", length = 32, nullable = false)
    private BanType banType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    public BanHistory(Cabinet cabinet, Date bannedAt, Date unbannedAt,
            BanType banType, User user) {
        this.cabinet = cabinet;
        this.bannedAt = bannedAt;
        this.unbannedAt = unbannedAt;
        this.banType = banType;
        this.user = user;
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
