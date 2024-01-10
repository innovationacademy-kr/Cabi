package org.ftclub.cabinet.alarm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AlarmTypeResponseDto {

    private boolean slack;
    private boolean email;
    private boolean push;

}
