package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReturnCabinetDataDto {
    private CabinetStatus status;
    private LentType lentType;
    private LentHistory[] lentHistories; // 기존 Lent[] lents 였던 부분입니다.
}