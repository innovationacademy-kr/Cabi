package org.ftclub.cabinet.cabinet.domain;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class CabinetDto {
    /**
     * NOTE: 추후에 불필요한 필드 제거
     */
    private Long cabinetId;

    private Integer visibleNum;

    private CabinetStatus status;

    private LentType lentType;

    private Integer maxUser;

    private String statusNote;

    private Grid grid;

    private CabinetPlace cabinetPlace;
}
