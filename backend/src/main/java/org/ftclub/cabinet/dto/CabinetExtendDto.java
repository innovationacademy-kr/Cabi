package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CabinetExtendDto extends CabinetDto {
    /**
     * FIXME:
     * 기존과 달라진 db 구조에 따라 dto의 변화가 있어야 할 것 같습니다.
     * 우선은 같게 적어놨습니다.
     */
    private String building; // 기존의 location
    private Integer floor;
    private String section;
    private String memo;
}