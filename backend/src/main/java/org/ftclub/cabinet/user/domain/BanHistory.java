package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BanHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long banHistoryId;

    private Long cabinetId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date bannedAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date unbannedAt;

    @Enumerated(EnumType.STRING)
    private BanType banType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;

    public BanHistory(Long banHistoryId, Long cabinetId, Date bannedAt, Date unbannedAt, BanType banType, User user) {
        this.cabinetId = cabinetId;
        this.bannedAt = bannedAt;
        this.unbannedAt = unbannedAt;
        this.banType = banType;
        this.user = user;
    }
}
