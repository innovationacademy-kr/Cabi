package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "NAME", length = 32, unique = true, nullable = false)
    private String name;
    @Column(name = "EMAIL", unique = true)
    private String email;
    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "BLACKHOLED_AT")
    private Date blackholedAt = null;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "DELETED_AT", length = 32)
    private Date deletedAt = null;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "ROLE", length = 32, nullable = false)
    private UserRole role;

    public User(String name, String email, Date blackholedAt, UserRole userRole) {
        this.name = name;
        this.email = email;
        this.blackholedAt = blackholedAt;
        this.role = userRole;
    }

    public Long getUserId() {
        return userId;
    }
}
