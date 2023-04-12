package org.ftclub.cabinet.admin.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "ADMIN_USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ADMIN_USER_ID")
    private Long adminUserId;

    @Column(name = "EMAIL", length = 128, unique = true, nullable = false)
    private String email;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "ROLE", length = 16, nullable = false)
    private AdminRole role = AdminRole.NONE;

    public AdminUser(String email) {
        this.email = email;
    }
}
