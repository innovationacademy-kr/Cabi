package org.ftclub.cabinet.auth.service;

import org.ftclub.cabinet.config.ApiProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;

public interface AuthFacadeService {

	void requestLoginToApi(HttpServletResponse res, ApiProperties apiProperties) throws IOException;

	void handleLogin(String code, HttpServletRequest req, HttpServletResponse res,
	                 ApiProperties apiProperties, LocalDateTime now);

	void masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
	                 HttpServletResponse res, LocalDateTime now);

	void logout(HttpServletResponse res, ApiProperties apiProperties);
}
