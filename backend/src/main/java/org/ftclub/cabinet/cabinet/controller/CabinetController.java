package org.ftclub.cabinet.cabinet.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.CabinetDto;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import static org.ftclub.cabinet.auth.AuthGuard.Level.USER_OR_ADMIN;

@Component
@RequiredArgsConstructor
@RestController
public class CabinetController {

    private final CabinetService cabinetService;

    @GetMapping("/cabinet/{cabinetId}")
    public CabinetDto getCabinetById(
            @PathVariable Long cabinetId) {
        return cabinetService.getCabinetById(cabinetId);
    }
}
