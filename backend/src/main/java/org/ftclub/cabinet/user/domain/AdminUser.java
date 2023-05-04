package org.ftclub.cabinet.user.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ADMIN_USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ADMIN_USER_ID")
    private Long adminUserId;

    @Column(name = "EMAIL", length = 128, unique = true, nullable = false)
    private String email;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "ROLE", length = 16, nullable = false)
    private AdminRole role = AdminRole.NONE;

    public AdminUser(String email, AdminRole role) {
        this.email = email;
        this.role = role;
    }

    public void changeAdminRole(AdminRole role) {
        this.role = role;
    }
}
