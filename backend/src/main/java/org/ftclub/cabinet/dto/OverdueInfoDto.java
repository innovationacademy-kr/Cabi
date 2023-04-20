package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OverdueInfoDto {
    private String name;
    private Integer floor;
    private Integer visibleNum;
    private Date startedAt;
    private Date expiredAt;
}