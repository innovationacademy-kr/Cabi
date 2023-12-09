package org.ftclub.cabinet.alarm.discord;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Builder
@Getter
public class DiscordAlarmMessage {
	private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	private final String subject;
	private final String packageName;
	private final String httpMethod;
	private final String methodName;
	private final String parameters;
	private final String returnValue;

	@Override
	public String toString() {
		return "```java\n" +
				"Subject: \"" + subject + "\"\n" +
				"Issued at: \"" + LocalDateTime.now().format(formatter) + "\"\n" +
				"Package: \"" + packageName + "\"\n" +
				"HTTP: \"" + httpMethod + "\"\n" +
				"Method: \"" + methodName + "\"\n" +
				"Parameters: \"" + parameters + "\"\n" +
				"Return: " + returnValue + "\n" +
				"```";
	}
}
