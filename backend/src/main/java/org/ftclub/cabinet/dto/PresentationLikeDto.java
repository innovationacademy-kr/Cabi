package org.ftclub.cabinet.dto;

import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.user.domain.User;

import java.time.LocalDateTime;

public class PresentationLikeDto {
	private Long presentationId;
	private Long userId;
	private LocalDateTime createdAt;
}
