package org.ftclub.cabinet.admin.slack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;


@AllArgsConstructor
@Getter
@ToString
public class SlackMessageDto {

	private String receiverName;
	private String message;

}
