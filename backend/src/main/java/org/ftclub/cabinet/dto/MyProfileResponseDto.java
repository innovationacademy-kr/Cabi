package org.ftclub.cabinet.dto;

import lombok.Getter;

@Getter
public class MyProfileResponseDto extends UserProfileDto {

    private final Long cabinetId;

    public MyProfileResponseDto(Long userId, String name, Long cabinetId) {
        super(userId, name);
        this.cabinetId = cabinetId;
    }
}
