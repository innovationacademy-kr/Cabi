package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserFacadeService {

    public MyProfileResponseDto getMyProfile(UserSessionDto user) {
        log.debug("Called getMyProfile: {}", user.getName());

        // Cabinet cabinet = lentService.findActiveLentCabinetByUserId();


    }

}

