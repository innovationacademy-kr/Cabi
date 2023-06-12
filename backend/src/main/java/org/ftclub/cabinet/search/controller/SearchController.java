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
            @RequestParam("visibleNum") Integer visibleNum
    ) {
        return cabinetFacadeService.getCabinetsInfo(visibleNum);
    }

    @GetMapping("/users-simple")
    public UserProfilePaginationDto getUsersProfile(
            @PathVariable("name") String name,
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size
    ) {
        return userFacadeService.getUserProfileListByPartialName(name, page, size);
    }

    @GetMapping("/users")
    public UserCabinetPaginationDto getCabinetsLentInfo(
            @PathVariable("name") String name,
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size
    ){
        return userFacadeService.findUserCabinetListByPartialName(name, page, size);
    }


}
