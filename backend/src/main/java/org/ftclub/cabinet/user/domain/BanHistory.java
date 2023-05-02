package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "BAN_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class BanHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BAN_HISTORY_ID")
    private Long banHistoryId;

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

    public BanHistory(Cabinet cabinet, Date bannedAt, Date unbannedAt, BanType banType, User user) {
        this.cabinet = cabinet;
        this.bannedAt = bannedAt;
        this.unbannedAt = unbannedAt;
        this.banType = banType;
        this.user = user;
    }
}
