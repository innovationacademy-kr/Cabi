package org.ftclub.cabinet.cabinet.controller;

import static org.ftclub.cabinet.auth.AuthGuard.Level.USER_OR_ADMIN;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.cabinet.service.CabinetServiceImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Component
@RequiredArgsConstructor
@RestController
public class CabinetController {

    private final CabinetServiceImpl cabinetService;

    @GetMapping("/save")
    public String test() {
        this.cabinetService.saveMock();
        return "hello";
    }

    @GetMapping("/get")
    @AuthGuard(level = USER_OR_ADMIN)
    public String test2() {
        System.out.printf("/get activated\n");
//        this.cabinetService.getShareCabinet(1);
        return "hello";
    }

}
