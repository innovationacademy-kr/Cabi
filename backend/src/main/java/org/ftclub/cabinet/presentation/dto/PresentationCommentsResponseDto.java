package org.ftclub.cabinet.presentation.dto;

import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PresentationCommentsResponseDto {

	private final List<PresentationCommentResponseDto> data;
}
