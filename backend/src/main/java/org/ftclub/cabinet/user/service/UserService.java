package org.ftclub.cabinet.user.service;

import java.util.Date;
import java.util.List;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.UserRole;

public interface UserService {

    /* 동아리일 경우 email은 어떻게 할 지? */
    void createUser(String name, String email, Date blackholedAt, UserRole role);

    void createAdminUser(String email);

    void deleteUserById(Long userId);

    void deleteAdminUserById(Long adminUserId);

    void updateAdminUserRole(Long adminUserId);

    void updateBlackholedAtById(Long userId);

    void banUser(Long userId, int days); // 며칠 벤을 할 지는 BanPolicy에서 계산하는 것으로 결정

    void unbanUser(Long userId);

    MyProfileResponseDto getMyProfile(UserSessionDto user);

    List<BlockedUserPaginationDto> getAllBanUsers();

    //이거 한글 다 쓴다음에 복붙하면 편하네요 good
    // + API 명세되어있는 값들 리턴하는 메서드들
}
