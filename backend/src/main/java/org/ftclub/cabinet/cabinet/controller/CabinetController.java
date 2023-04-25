package org.ftclub.cabinet.cabinet.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AdminAuthGuard;
import org.ftclub.cabinet.auth.MainAuthGuard;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Component
@RequiredArgsConstructor
@RestController
public class CabinetController {
    private final CabinetService cabinetService;

    @GetMapping("/save")
    @AdminAuthGuard
    public String test() {
        this.cabinetService.saveMock();
        return "hello";
    }

    @GetMapping("/get")
//    @AdminAuthGuard
    @MainAuthGuard
    public String test2() {
        System.out.printf("/get activated\n");
//        this.cabinetService.getShareCabinet(1);
        return "hello";
    }

}
