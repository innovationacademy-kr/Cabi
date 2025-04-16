package org.ftclub.cabinet.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class PresentationCommentServiceCreationDto {
    private final Long userId;
	private final Long presentationId;
	private final String commentDetail;
}
