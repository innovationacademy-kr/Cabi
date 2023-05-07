package org.ftclub.cabinet.utils.leave.absence;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaveAbsenceManagerImpl implements LeaveAbsenceManager {

    @Override
    public Boolean checkLeaveAbsence(String name) {
        return false;
    }

    @Override
    public void handleLeaveAbsence(UserDto user) {
        return;
    }
}
