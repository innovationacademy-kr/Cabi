package org.ftclub.cabinet.user.service;

import org.ftclub.cabinet.dto.UserSessionDto;

public interface LentExtensionService {

    void issueLentExtension();

    void deleteLentExtension();

    void useLentExtension(Long userId, String username);

    void assignLentExtension(String username);

}
