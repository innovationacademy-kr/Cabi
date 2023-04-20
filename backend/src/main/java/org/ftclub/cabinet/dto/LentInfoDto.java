package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LentInfoDto {
    private Long lentHistoryId;
    private Long lentCabinetId;
    private Long lentUserId;
    private Date startedAt; // 기존 lent_time 이었습니다.
    private Date expiredAt; // 기존 expire_time 이었습니다.
    /**
     * FIXME:
     * 사용되는 곳이 없을 것이라고 판단되어 삭제하는 게 맞을 것 같음
     */
    private Integer extension;
}