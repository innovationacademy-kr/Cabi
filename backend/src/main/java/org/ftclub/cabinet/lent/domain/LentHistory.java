package org.ftclub.cabinet.lent.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.user.domain.User;

import javax.persistence.*;
import java.util.Date;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LentHistory {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lentHistoryId;
    @Column(nullable = false) @Temporal(value = TemporalType.TIMESTAMP)
    private Date startAt = null;
    @Temporal(value = TemporalType.TIMESTAMP)
    private Date endedAt = null;
    @Temporal(value = TemporalType.TIMESTAMP)
    private Date expiredAt = null;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CABINET_ID")
    private Cabinet cabinet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LENT_CABINET_DETAIL_ID")
    private LentCabinetDetail lentCabinetDetail;

    public LentHistory(Date startAt, Date expiredAt, User user, Cabinet cabinet, LentCabinetDetail lentCabinetDetail) {
        this.startAt = startAt;
        this.expiredAt = expiredAt;
        this.user = user;
        this.cabinet = cabinet;
        this.lentCabinetDetail = lentCabinetDetail;
    }
}
