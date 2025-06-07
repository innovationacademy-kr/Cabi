package org.ftclub.cabinet.admin.dto;

import java.util.Set;
import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;

/**
 * 어드민의 update 요청을 위한 dto로 thumbnail은 별도로 관리합니다.
 */
@Getter
@Builder
public class AdminPresentationUpdateServiceDto {

	private final Category category;
	private final Duration duration;

	private final String title;
	private final String summary;
	private final String outline;
	private final String detail;
	private final String videoLink;

	private final boolean recordingAllowed;
	private final boolean publicAllowed;
	private final boolean thumbnailUpdated;

	// 프레젠테이션 업데이트 시 변경 가능한 필드들 (위 필드에 변동이 있다면 동일하게 업데이트 필요)
	private final Set<String> toUpdate = Set.of(
			"title", "category", "duration",
			"summary", "outline", "detail",
			"publicAllowed", "recordingAllowed", "videoLink"
	);
}
