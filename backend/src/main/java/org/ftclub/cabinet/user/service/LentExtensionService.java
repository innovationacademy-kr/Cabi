package org.ftclub.cabinet.user.service;

import java.util.List;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface LentExtensionService {

	List<LentExtension> getLentExtensionByUserId(Long userId);

	List<LentExtension> getLentExtensionNotExpiredByUserId(Long userId);

	Page<LentExtension> getAllLentExtension(PageRequest pageable);

	Page<LentExtension> getAllActiveLentExtension(PageRequest pageable);

	public void issueLentExtension();

	public void deleteLentExtension();

	public void useLentExtension(UserSessionDto userSessionDto);
}
