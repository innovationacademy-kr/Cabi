package org.ftclub.cabinet.auth.service;

import java.io.IOException;
import java.time.LocalDateTime;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.config.ApiProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;

public interface AuthFacadeService {

	void requestLoginToApi(HttpServletResponse res, ApiProperties apiProperties) throws IOException;

	void handleLogin(String code, HttpServletRequest req, HttpServletResponse res,
			ApiProperties apiProperties, LocalDateTime now);

	void masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
			HttpServletResponse res, LocalDateTime now);

	void logout(HttpServletResponse res, ApiProperties apiProperties);

	void handleTestLogin(HttpServletRequest req, ApiProperties apiProperties,
			HttpServletResponse res, LocalDateTime now);
}
