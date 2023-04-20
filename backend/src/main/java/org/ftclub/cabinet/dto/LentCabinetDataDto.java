package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LentCabinetDataDto {
    private Optional<Long> newLentId; // 원래는 Optional인데 따로 처리를 해야하는지?
    private CabinetStatus status;
    private LentType lentType;
    private Integer lentCount;
    private Optional<Date> expiredAt; // 원래는 Optional인데 따로 처리를 해야하는지?
    private Integer maxUser;
}