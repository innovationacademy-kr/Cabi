package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class AguMailResponse {

	private final String oauthMail;
	private final String date = LocalDateTime.now().format(
			DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss 'KST'", Locale.US)
	);
	private final int expiryTime;
}
