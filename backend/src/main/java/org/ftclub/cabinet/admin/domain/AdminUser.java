package org.ftclub.cabinet.admin.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminUserId;

    @Column(length = 128, unique = true)
    private String email;

    @Enumerated(value = EnumType.STRING)
    private AdminRole role = AdminRole.NONE;

    public AdminUser(String email) {
        this.email = email;
    }
}
