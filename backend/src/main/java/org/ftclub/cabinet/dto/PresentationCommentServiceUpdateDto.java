package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@EqualsAndHashCode
@Getter
@ToString
@AllArgsConstructor
public class PresentationCommentServiceUpdateDto {

	private final Long userId;
	private final Long presentationId;
	private final Long commentId;
	private final String commentDetail;
}
