package org.ftclub.cabinet.alarm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.thymeleaf.context.Context;

@Getter
@AllArgsConstructor
@ToString
public class MailDto {

	private String subject;
	private String template;
	private Context context;
}
