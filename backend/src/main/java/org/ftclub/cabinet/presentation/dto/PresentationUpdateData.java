package org.ftclub.cabinet.presentation.dto;

import java.util.HashSet;
import java.util.Set;
import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;

/**
 * 프레젠테이션 수정을 위한 공통 DTO
 * <p>
 * USER-toUpdate: summary, outline, detail, publicAllowed
 * </p>
 * <p>
 * ADMIN-toUpdate: USER-toUpdate + { title, category, duration, videoLink, recordingAllowed }
 */
@Getter
@Builder
public class PresentationUpdateData {

	// --- [ADMIN, USER] common field ---
	private final String summary;
	private final String outline;
	private final String detail;
	private final boolean publicAllowed;

	// --- [ADMIN] field ---
	private final Duration duration;
	private final Category category;
	private final String title;
	private final String videoLink;
	private final boolean recordingAllowed;

	// toUpdate fields hashSet for easy comparison
	@Builder.Default
	private final Set<String> toUpdate = new HashSet<>();
}
