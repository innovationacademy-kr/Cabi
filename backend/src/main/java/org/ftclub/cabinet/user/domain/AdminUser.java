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

/**
 * 관리자 엔티티 클래스입니다.
 */
@Entity
@Table(name = "ADMIN_USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ADMIN_USER_ID")
    private Long adminUserId;

    /**
     * OAuth 방식을 사용하기 때문에 비밀번호 없이 이메일만 저장합니다.
     */
    @Column(name = "EMAIL", length = 128, unique = true, nullable = false)
    private String email;

    /**
     * {@link AdminRole}
     */
    @Enumerated(value = EnumType.STRING)
    @Column(name = "ROLE", length = 16, nullable = false)
    private AdminRole role = AdminRole.NONE;

    protected AdminUser(String email, AdminRole role) {
        this.email = email;
        this.role = role;
    }

    public static AdminUser of(String email, AdminRole role) {
        return new AdminUser(email, role);
    }

    @Override
    public boolean equals(final Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof AdminUser)) {
            return false;
        }
        return (this.adminUserId.equals(((AdminUser) other).getAdminUserId()));
    }

    public void changeAdminRole(AdminRole role) {
        this.role = role;
    }
}
