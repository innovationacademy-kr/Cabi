package org.ftclub.cabinet.lent.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.user.domain.User;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "LENT_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LentHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LENT_HISTORY_ID")
    private Long lentHistoryId;

    private Long userId;

    private Long cabinetId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "LENT_CABINET_DETAIL_ID")
    private LentCabinetDetail lentCabinetDetail;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "STARTED_AT",nullable = false)
    private Date startedAt;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "EXPIRED_AT")
    private Date expiredAt = null;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "ENDED_AT")
    private Date endedAt = null;

    public LentHistory(Date startedAt, Date expiredAt, Long userId, Long cabinetId, LentCabinetDetail lentCabinetDetail) {
        this.startedAt = startedAt;
        this.expiredAt = expiredAt;
        this.userId = userId;
        this.cabinetId = cabinetId;
        this.lentCabinetDetail = lentCabinetDetail;
    }
}
