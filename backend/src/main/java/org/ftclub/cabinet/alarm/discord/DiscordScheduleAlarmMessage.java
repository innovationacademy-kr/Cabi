package org.ftclub.cabinet.alarm.discord;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DiscordScheduleAlarmMessage {

	private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
			"yyyy-MM-dd HH:mm:ss");
	private final String subject;
	private final String taskName;
	private final String taskMethodName;
	private final String taskParameters;

	@Override
	public String toString() {
		return "```java\n" +
				"Subject: \"" + subject + "\"\n" +
				"Task: \"" + taskName + "\"\n" +
				"Issued at: \"" + LocalDateTime.now().format(formatter) + "\"\n" +
				"Method: \"" + taskMethodName + "\"\n" +
				"Parameters: \"" + taskParameters + "\"\n" +
				"```";
	}
}

