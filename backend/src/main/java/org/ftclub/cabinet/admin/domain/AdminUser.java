package org.ftclub.cabinet.admin.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

@Entity
@Table
@Access(value = AccessType.PROPERTY)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long adminUserid;

    @Column(length = 128, unique = true)
    private String email;

    @Column
    @Enumerated(value = EnumType.STRING)
    private AdminRole role = AdminRole.NONE;

    public AdminUser(String email) {
        this.email = email;
    }
}
