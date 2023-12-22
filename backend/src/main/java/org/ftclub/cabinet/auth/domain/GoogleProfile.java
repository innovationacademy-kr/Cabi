package org.ftclub.cabinet.auth.domain;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GoogleProfile {
	private final String email;
}
