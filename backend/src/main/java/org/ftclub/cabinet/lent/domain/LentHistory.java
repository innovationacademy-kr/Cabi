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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CABINET_ID", nullable = false)
    private Cabinet cabinet;

    @ManyToOne(fetch = FetchType.LAZY)
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

    public LentHistory(Date startedAt, Date expiredAt, User user, Cabinet cabinet, LentCabinetDetail lentCabinetDetail) {
        this.startedAt = startedAt;
        this.expiredAt = expiredAt;
        this.user = user;
        this.cabinet = cabinet;
        this.lentCabinetDetail = lentCabinetDetail;
    }
}
