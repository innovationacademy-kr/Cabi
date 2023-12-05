package org.ftclub.cabinet.user.service;

import org.ftclub.cabinet.dto.LentExtensionResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;

import java.util.List;

public interface LentExtensionService {

	void issueLentExtension();

	void useLentExtension(Long userId, String username);

	void assignLentExtension(String username);

	List<LentExtensionResponseDto> getActiveLentExtensionList(UserSessionDto userSessionDto);

	LentExtensionResponseDto getActiveLentExtension(UserSessionDto userSessionDto);


}
