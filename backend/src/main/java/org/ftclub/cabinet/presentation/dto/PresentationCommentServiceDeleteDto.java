package org.ftclub.cabinet.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@EqualsAndHashCode
@Getter
@ToString
@AllArgsConstructor
public class PresentationCommentServiceDeleteDto {

	private final Long userId;
	private final Long presentationId;
	private final Long commentId;
}
