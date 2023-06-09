package org.ftclub.cabinet.auth.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.servlet.http.HttpServletResponse;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminAuthControllerTest {

	@Autowired
	MockMvc mvc;
	@Autowired
	JwtProperties jwtProperties;

	@Autowired
	MasterProperties masterProperties;

	@Autowired
	ObjectMapper objectMapper;

	@Test
	void 어드민_로그인_요청() throws Exception {
		//리디렉션 302
		mvc.perform(get("/v4/admin/auth/login"))
				.andExpect(status().isFound());
	}

	@Test
	void 최고_관리자_로그인_요청() throws Exception {
		String dto = objectMapper.writeValueAsString(new MasterLoginDto(masterProperties.getId(),
				masterProperties.getPassword()));

		String emptyDto = "";

		String invalidDto2 = objectMapper.writeValueAsString(new MasterLoginDto("invalidId",
				"invalidPassword"));

		mvc.perform(post("/v4/admin/auth/login")
						.content(String.valueOf(dto))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		mvc.perform(post("/v4/admin/auth/login")
						.content(emptyDto)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());

		mvc.perform(post("/v4/admin/auth/login")
						.content(invalidDto2)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void 어드민_로그인_콜백() throws Exception {
		//valid한 코드는 알 수 없음
		String inValidCode = "thisMustBeBadGateWayBecauseOfInvalidCode";

		mvc.perform(get("/v4/admin/auth/login/callback?code={code}", inValidCode))
				.andExpect(status().isBadGateway());
	}

	@Test
	void 어드민_로그아웃_요청() throws Exception {
		//given
		String tokenName = jwtProperties.getAdminTokenName();

		//when
		MvcResult result = mvc.perform(get("/v4/admin/auth/logout")).andReturn();

		//then
		assertEquals(result.getResponse().getStatus(), HttpServletResponse.SC_OK);
		assertEquals(result.getResponse().getCookie(tokenName).getValue(), null);
		assertEquals(result.getResponse().getCookie(tokenName).getMaxAge(), 0);
	}
}
