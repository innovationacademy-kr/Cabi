package org.ftclub.cabinet.user.service;

import java.util.Date;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.UserRole;

public interface UserService {

    /* 동아리일 경우 email은 어떻게 할 지? */
    boolean checkUserExists(String name);

    void createUser(String name, String email, Date blackholedAt, UserRole role);

    boolean checkAmdinUserExists(String name);

    void createAdminUser(String email);

    void deleteUser(long userId);

    void deleteAdminUser(long adminUserId);

    void updateAdminUserRole(long adminUserId, AdminRole role);

    void updateUserBlackholedAtById(long userId, Date newBlackholedAt);

    void banUser(long userId, Date expiredAt, Date endedAt);

    //void unbanUser(long userId);

    MyProfileResponseDto getMyProfile(UserSessionDto user);

    //List<BlockedUserPaginationDto> getAllBanUsers();

    //이거 한글 다 쓴다음에 복붙하면 편하네요 good
    // + API 명세되어있는 값들 리턴하는 메서드들
}
