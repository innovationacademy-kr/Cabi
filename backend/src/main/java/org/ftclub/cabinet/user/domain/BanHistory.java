package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Access(value = AccessType.PROPERTY)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BanHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long banHistoryId;

    @Column
    private Long cabinetId;

    @Column @Temporal(TemporalType.TIMESTAMP)
    private Date bannedAt;

    @Column @Temporal(TemporalType.TIMESTAMP)
    private Date unbannedAt;

    @Column @Enumerated(EnumType.STRING)
    private BanType banType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public BanHistory(Long banHistoryId, Long cabinetId, Date bannedAt, Date unbannedAt, BanType banType, User user) {
        this.cabinetId = cabinetId;
        this.bannedAt = bannedAt;
        this.unbannedAt = unbannedAt;
        this.banType = banType;
        this.user = user;
    }
}
