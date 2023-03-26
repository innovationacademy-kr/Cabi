package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user")
@Access(value = AccessType.PROPERTY)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Long userId;

    @Column(unique = true)
    private String name;
    @Column(unique = true)
    private String email;
    @Column @Temporal(value = TemporalType.TIMESTAMP)
    private Date blackholedAt = null;
    @Column
    @Enumerated(value = EnumType.STRING)
    private UserRole userRole;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Column
    private List<LentHistory> lentHistoryList = new ArrayList<>();

    public User(String name, String email, Date blackholedAt, UserRole userRole) {
        this.name = name;
        this.email = email;
        this.blackholedAt = blackholedAt;
        this.userRole = userRole;
    }
}
