package org.ftclub.cabinet.user.service;

import java.util.Date;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.UserRole;

public interface UserService {

    /* 동아리일 경우 email은 어떻게 할 지? */
    boolean checkUserExists(String name);

    void createUser(String name, String email, Date blackholedAt, UserRole role);

    boolean checkAmdinUserExists(String email);

    void createAdminUser(String email);

    void deleteUser(Long userId);

    void deleteAdminUser(Long adminUserId);

    void updateAdminUserRole(Long adminUserId, AdminRole role);

    void updateUserBlackholedAtById(Long userId, Date newBlackholedAt);

    void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt, Date expiredAt);

    void unbanUser(Long userId);

//    MyProfileResponseDto getMyProfile(UserSessionDto user);

    //List<BlockedUserPaginationDto> getAllBanUsers();

//    List<UserSessionDto> getAllUser();

    // userService에 있는게 맞는지..
    Long getAccumulateOverdueDaysByUserId(Long userId);

    boolean checkUserIsBanned(Long userId);
}
