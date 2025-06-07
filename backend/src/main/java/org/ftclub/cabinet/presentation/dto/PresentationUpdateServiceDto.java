package org.ftclub.cabinet.presentation.dto;

import java.util.Set;
import lombok.Builder;
import lombok.Getter;

/**
 * 유저의 update 요청을 위한 dto로 thumbnail은 별도로 관리합니다.
 */
@Getter
@Builder
public class PresentationUpdateServiceDto {

	private final String summary;
	private final String outline;
	private final String detail;
	private final boolean publicAllowed;
	private final boolean thumbnailUpdated;

	// 프레젠테이션 업데이트 시 변경 가능한 필드들 (위 필드에 변동이 있다면 동일하게 업데이트 필요)
	private final Set<String> toUpdate = Set.of("summary", "outline", "detail", "publicAllowed");
}
