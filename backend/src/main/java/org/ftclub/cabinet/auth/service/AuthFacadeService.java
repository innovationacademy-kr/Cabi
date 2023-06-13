package org.ftclub.cabinet.auth.service;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.config.ApiProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;

public interface AuthFacadeService {

	void requestLoginToApi(HttpServletResponse res, ApiProperties apiProperties) throws IOException;

	void handleLogin(String code, HttpServletRequest req, HttpServletResponse res,
			ApiProperties apiProperties);

	void masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
			HttpServletResponse res);

	void logout(HttpServletResponse res, ApiProperties apiProperties);
}
