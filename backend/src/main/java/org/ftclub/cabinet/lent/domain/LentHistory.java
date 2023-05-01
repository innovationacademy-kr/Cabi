package org.ftclub.cabinet.lent.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "LENT_HISTORY", uniqueConstraints = {
        @UniqueConstraint(name = "unique_index", columnNames = {"LENT_HISTORY_ID", "VERSION"})
        // table의 column 이름
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LENT_HISTORY_ID")
    private Long lentHistoryId;

    @Column(name = "VERSION")
    private Long version;

    private Long userId;

    private Long cabinetId;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "STARTED_AT", nullable = false)
    private Date startedAt;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "EXPIRED_AT")
    private Date expiredAt = null;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "ENDED_AT")
    private Date endedAt = null;

    public LentHistory(Date startedAt, Date expiredAt, Long userId, Long cabinetId, Long version) {
        this.startedAt = startedAt;
        this.expiredAt = expiredAt;
        this.userId = userId;
        this.cabinetId = cabinetId;
        this.version = version;
    }
}
