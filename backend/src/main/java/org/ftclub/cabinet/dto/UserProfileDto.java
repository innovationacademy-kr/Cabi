package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserProfileDto {
    private final Long userId;
    private final String  name;
}
