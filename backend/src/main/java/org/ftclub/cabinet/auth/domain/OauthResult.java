package org.ftclub.cabinet.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.user.domain.User;

@Getter
@AllArgsConstructor
public class OauthResult {

	private User user;
	private boolean redirectionToProfile;
}
