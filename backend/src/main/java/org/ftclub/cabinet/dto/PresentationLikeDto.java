package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.user.domain.User;

import java.time.LocalDateTime;
@Getter
@AllArgsConstructor
public class PresentationLikeDto {
	private Long presentationId;
	private Long userId;
	private LocalDateTime createdAt;
}
