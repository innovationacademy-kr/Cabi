package org.ftclub.cabinet.user.domain;

import java.util.Objects;
import java.util.regex.Pattern;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.el.util.ExceptionUtils;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

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
    @NotNull
    @Email
    @Column(name = "EMAIL", length = 128, unique = true, nullable = false)
    private String email;

    /**
     * {@link AdminRole}
     */
    @Enumerated(value = EnumType.STRING)
    @Column(name = "ROLE", length = 16, nullable = false)
    private AdminRole role = AdminRole.NONE;

    private boolean isValid() {
        return role != null && role.isValid() && email != null &&
                Pattern.matches(
                        "^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\\.[A-Za-z0-9\\-]+\\.*[A-Za-z0-9\\-]*",
                        email);
    }

    protected AdminUser(String email, AdminRole role) {
        this.email = email;
        this.role = role;
    }

    public static AdminUser of(String email, AdminRole role) {
        AdminUser adminUser = new AdminUser(email, role);
        ExceptionUtil.throwIfFalse(adminUser.isValid(),
                new DomainException(ExceptionStatus.INVALID_ARGUMENT));
        return adminUser;
    }

    @Override
    public boolean equals(final Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof AdminUser)) {
            return false;
        }
        AdminUser adminUser = (AdminUser) other;
        return Objects.equals(adminUserId, adminUser.adminUserId);
    }

    public void changeAdminRole(AdminRole role) {
        this.role = role;
        ExceptionUtil.throwIfFalse(this.isValid(),
                new DomainException(ExceptionStatus.INVALID_ARGUMENT));
    }
}