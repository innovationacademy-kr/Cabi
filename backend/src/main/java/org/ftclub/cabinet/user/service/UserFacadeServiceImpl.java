package org.ftclub.cabinet.user.service;

import java.util.Optional;
import lombok.AllArgsConstructor;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {

    private final LentRepository lentRepository;

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

//    public List<BlockedUserPaginationDto> getAllBanUsers() {
//
//    }

//    public List<UserSessionDto> getAllUser() {
//
//    }
}
