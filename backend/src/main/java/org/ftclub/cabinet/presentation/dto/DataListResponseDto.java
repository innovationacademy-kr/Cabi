package org.ftclub.cabinet.presentation.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * responseDto들을 List형태로 감싸주는 공통 wrapper
 *
 * @param <ResponseDto> responseDto의 타입
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DataListResponseDto<ResponseDto> {

	private List<ResponseDto> data;
}
