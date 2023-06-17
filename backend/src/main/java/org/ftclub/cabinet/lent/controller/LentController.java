package org.ftclub.cabinet.lent.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.UpdateCabinetMemoDto;
import org.ftclub.cabinet.dto.UpdateCabinetTitleDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/lent")
public class LentController {

    private final LentFacadeService lentFacadeService;

    @PostMapping("/cabinets/{cabinetId}")
    public void startLentCabinet(
            @UserSession UserSessionDto user,
            @PathVariable Long cabinetId) {
        lentFacadeService.startLentCabinet(user.getUserId(), cabinetId);
    }

    @PatchMapping("/return")
    public void endLent(
            @UserSession UserSessionDto userSessionDto) {
        lentFacadeService.endLentCabinet(userSessionDto);
    }

    @PatchMapping("/return-memo")
    public void endLentWithMemo(
            @UserSession UserSessionDto userSessionDto,
            @Valid @RequestBody LentEndMemoDto lentEndMemoDto) {
        lentFacadeService.endLentCabinetWithMemo(userSessionDto, lentEndMemoDto);
    }

    @PatchMapping("/me/memo")
    public void updateCabinetMemo(
            @UserSession UserSessionDto user,
            @Valid @RequestBody UpdateCabinetMemoDto updateCabinetMemoDto) {
        lentFacadeService.updateCabinetMemo(user, updateCabinetMemoDto);
    }

    @PatchMapping("/me/cabinet-title")
    public void updateCabinetTitle(
            @UserSession UserSessionDto user,
            @Valid @RequestBody UpdateCabinetTitleDto updateCabinetTitleDto) {
        lentFacadeService.updateCabinetTitle(user, updateCabinetTitleDto);
    }

    @GetMapping("/me")
    public ResponseEntity<MyCabinetResponseDto> getMyLentInfo(
            @UserSession UserSessionDto user) {
        MyCabinetResponseDto myCabinetResponseDto = lentFacadeService.getMyLentInfo(user);
        if (myCabinetResponseDto == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(myCabinetResponseDto);
    }

    @GetMapping("/me/histories")
    public LentHistoryPaginationDto getMyLentLog(
            @UserSession UserSessionDto user,
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size) {
        return lentFacadeService.getMyLentLog(user, page, size);
    }
}