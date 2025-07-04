package org.ftclub.cabinet.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PresentationLikeDto {
	private Long presentationId;
	private Long userId;
	private LocalDateTime createdAt;
}
