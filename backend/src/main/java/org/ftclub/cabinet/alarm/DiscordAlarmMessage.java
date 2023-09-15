package org.ftclub.cabinet.alarm;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DiscordAlarmMessage {
	private final String subject;
	private final String packageName;
	private final String httpMethod;
	private final String methodName;
	private final String parameters;
	private final String returnValue;

	@Override
	public String toString() {
		return "```java" +
				"Subject: \"" + subject + "\"\n" +
				"Package: \"" + packageName + "\"\n" +
				"HTTP: \"" + httpMethod + "\"\n" +
				"Method: \"" + methodName + "\"\n" +
				"Parameters: \"" + parameters + "\"\n" +
				"Return: \"" + returnValue + "\"\n" +
				"```";
	}
}
