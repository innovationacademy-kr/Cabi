package org.ftclub.cabinet.user.domain;

import java.util.Date;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    protected User(String name, String email, Date blackholedAt, UserRole userRole) {
        this.name = name;
        this.email = email;
        this.blackholedAt = blackholedAt;
        this.role = userRole;
    }

    public static User of(String name, String email, Date blackholedAt, UserRole userRole) {
        return new User(name, email, blackholedAt, userRole);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        User user = (User) o;
        return Objects.equals(userId, user.userId);
    }

    public boolean isUserRole(UserRole role) {
        return role.equals(this.role);
    }

    public void changeBlackholedAt(Date blackholedAt) {
        this.blackholedAt = blackholedAt;
    }

    public void setDeletedAt(Date deletedAt) {
        this.deletedAt = deletedAt;
    }
}
