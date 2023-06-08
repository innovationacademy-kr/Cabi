package org.ftclub.cabinet.search.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin/search")
public class SearchController {

    private final SearchFacadeService searchFacadeService;

    @GetMapping("/cabinets?visibleNum={number}")
    public CabinetInfoPaginationDto getCabinetsInfo(
            @RequestParam Integer visibleNum
    ) {
        return searchFacadeService.getCabinetsInfo(visibleNum);
    }
}
