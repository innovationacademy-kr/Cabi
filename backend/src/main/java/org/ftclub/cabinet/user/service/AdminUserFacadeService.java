package org.ftclub.cabinet.user.service;

import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;

public interface AdminUserFacadeService {

    /**
     * 유저를 어드민으로 승격시킵니다.
     *
     * @param email 유저 이메일
     */
    void promoteUserToAdmin(String email);

    /**
     * 연체 중인 유저 리스트를 반환합니다.
     *
     * @param page      페이지 번호
     * @param length    페이지 당 길이
     */
    OverdueUserCabinetPaginationDto getOverdueUserList(Integer page, Integer length);
}
