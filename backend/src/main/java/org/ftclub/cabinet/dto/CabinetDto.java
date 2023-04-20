package org.ftclub.cabinet.dto;

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

/**
 * @AllArgsConstructor
 * @NoArgsConstructor
 * @Data
 * public class CabinetDto {
 *
 *       FIXME:
 *       원래의 Dto를 옮겨왔습니다.
 *
 *      private Long cabinetID;
 *      private Integer visibleNum;
 *      private LentType lentType;
 *      private String title;
 *      private Integer maxUser;
 *      private CabinetStatus status;
 *      private String section;
 *}
 */
