package org.ftclub.cabinet.alarm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.thymeleaf.context.Context;

@Getter
@AllArgsConstructor
public class MailDto {

	String subject;
	String template;
	Context context;
}
