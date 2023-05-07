package org.ftclub.cabinet.user.service;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.UserRole;

public interface UserService {

    boolean checkUserExists(String name);

    /* 동아리일 경우 email은 어떻게 할 지? */
    void createUser(String name, String email, Date blackholedAt, UserRole role);

    boolean checkAmdinUserExists(String name);

    void createAdminUser(String email);

    void deleteUser(Long userId);

    void deleteAdminUser(Long adminUserId);

    void updateAdminUserRole(Long adminUserId, AdminRole role);

    void updateUserBlackholedAtById(Long userId, Date newBlackholedAt);

    void banUser(Long userId, LentType lentType, Date startAt, Date endedAt);

    //void unbanUser(long userId);

    MyProfileResponseDto getMyProfile(UserSessionDto user);

    //List<BlockedUserPaginationDto> getAllBanUsers();
}
