package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@AllArgsConstructor
@Getter
public class UpdateAlarmRequestDto {

    private final boolean slack;
    private final boolean email;
    private final boolean push;

}
