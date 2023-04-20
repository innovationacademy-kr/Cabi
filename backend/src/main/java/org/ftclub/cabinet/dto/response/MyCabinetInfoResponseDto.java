package org.ftclub.cabinet.dto.response;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MyCabinetInfoResponseDto extends CabinetExtendDto {
    private Optional<LentDto[]> lentInfo; // Optional 처리를 따로 해야하는지?
}