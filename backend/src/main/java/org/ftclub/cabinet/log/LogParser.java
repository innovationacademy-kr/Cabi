package org.ftclub.cabinet.log;

import org.ftclub.cabinet.alarm.DiscordAlarmMessage;
import org.springframework.stereotype.Component;

@Component
public class LogParser {
	private static final String delimiter = "#";

	public DiscordAlarmMessage parseToDiscordAlarmMessage(String log) {
		String[] tokens = log.split(delimiter);
		return DiscordAlarmMessage.builder()
				.subject(tokens[0])
				.packageName(tokens[1])
				.httpMethod(tokens[2])
				.methodName(tokens[3])
				.parameters(tokens[4])
				.returnValue(tokens[5])
				.build();
	}
}
