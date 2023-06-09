package org.ftclub.cabinet.search.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.web.bind.annotation.*;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/search")
public class SearchController {

    private final CabinetFacadeService cabinetFacadeService;
    private final UserFacadeService userFacadeService;

    @GetMapping("/cabinets")
    public CabinetInfoPaginationDto getCabinetsInfo(
            @RequestParam Integer visibleNum
    ) {
        return cabinetFacadeService.getCabinetsInfo(visibleNum);
    }

    @GetMapping("/users-simple")
    public UserProfilePaginationDto getUsersProfile(
            @PathVariable("name") String name,
            @RequestParam("page") Integer page,
            @RequestParam("length") Integer length
    ) {
        return userFacadeService.getUserProfileListByPartialName(name, page,length);
    }

    @GetMapping("/users")
    public UserCabinetPaginationDto getCabinetsLentInfo(
            @PathVariable String name,
            @RequestParam Integer page,
            @RequestParam Integer length
    ){
        return userFacadeService.findUserCabinetListByPartialName(name, page, length);
    }


}
