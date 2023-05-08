package org.ftclub.cabinet.user.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.BlockedUserDto;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {

    private final UserService userService;
    private final LentRepository lentRepository;
    private final BanHistoryRepository banHistoryRepository;
    private final UserRepository userRepository;

    @Override
    public List<UserSessionDto> getAllUser() {
        List<User> users = userRepository.findAll();
        /*
        해당 메서드 blackhole 모듈에서 쓰는 것 같은데 UserSessionDto로 꼭 반환해줘야하나요?
        추후 구현하겠습니다.
        * */
        return null;
    }

    @Override
    public MyProfileResponseDto getMyProfile(UserSessionDto user) {
        Optional<LentHistory> lentHistory = lentRepository.findFirstByUserIdAndEndedAtIsNull(
                user.getUserId());
        Long cabinetId;
        if (lentHistory.isPresent()) {
            cabinetId = lentHistory.get().getCabinetId();
        } else {
            cabinetId = (long) -1;
        }
        return new MyProfileResponseDto(user.getUserId(), user.getName(), cabinetId);
    }

    @Override
    public BlockedUserPaginationDto getAllBanUsers() {
        List<BanHistory> activeBanList = banHistoryRepository.findActiveBanList();
        List<BlockedUserDto> blockedUserDtos = activeBanList.stream()
                .map(b -> new BlockedUserDto(
                        b.getUserId(),
                        userRepository.findNameById(b.getUserId()),
                        b.getBannedAt(),
                        b.getUnbannedAt()))
                .collect(Collectors.toList());
        return new BlockedUserPaginationDto(blockedUserDtos, blockedUserDtos.size());
    }

    @Override
    public boolean checkUserExists(String name) {
        return userService.checkUserExists(name);
    }

    @Override
    public void createUser(String name, String email, Date blackholedAt, UserRole role) {
        userService.createUser(name, email, blackholedAt, role);
    }

    @Override
    public boolean checkAmdinUserExists(String email) {
        return userService.checkAmdinUserExists(email);
    }

    @Override
    public void createAdminUser(String email) {
        userService.createAdminUser(email);
    }

    @Override
    public void deleteUser(Long userId) {
        userService.deleteUser(userId);
    }

    @Override
    public void deleteAdminUser(Long adminUserId) {
        userService.deleteAdminUser(adminUserId);
    }

    @Override
    public void updateAdminUserRole(Long adminUserId, AdminRole role) {
        userService.updateAdminUserRole(adminUserId, role);
    }

    @Override
    public void updateUserBlackholedAtById(Long userId, Date newBlackholedAt) {
        userService.updateUserBlackholedAtById(userId, newBlackholedAt);
    }

    @Override
    public void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt,
            Date expiredAt) {
        userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);
    }

    @Override
    public void unbanUser(Long userId) {
        userService.unbanUser(userId);
    }

    @Override
    public boolean checkUserIsBanned(Long userId) {
        return userService.checkUserIsBanned(userId);
    }
}
