package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LentDto {
    private Long userId;
    private String name;
    private Long lentHistoryId; // 기존 lent id
    private Date startedAt;
    private Date expiredAt;
    /**
     * FIXME:
     * 사실상 필요 없는 부분이라 삭제해도 될 것 같습니다.
     */
    private Boolean isExpired;
}