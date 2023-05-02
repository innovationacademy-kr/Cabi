package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CabinetInfoPaginationDto {

    private final List<CabinetInfoResponseDto> result; // 캐비넷 정보 배열
    private final Integer totalLength; // DB에 저장된 총 결과의 길이
}
