package org.ftclub.cabinet.user.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthGuard.Level;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserFacadeServiceImpl implements AdminUserFacadeService {

    private final AdminUserService adminUserService;
    private final UserRepository userRepository;
    private final CabinetRepository cabinetRepository;
    private final LentRepository lentRepository;
    private final CabinetMapper cabinetMapper;

    @Override
    @AuthGuard(level = Level.ADMIN_ONLY) // TODO: SUPER 권한 필요
    public void promoteUserToAdmin(String email) {
        adminUserService.promoteUserToAdmin(email);
    }

    @Override
    @AuthGuard(level = Level.ADMIN_ONLY)
    public OverdueUserCabinetPaginationDto getOverdueUserList(Integer page, Integer length) {
        Date now = new Date();
        List<OverdueUserCabinetDto> overdueList = new ArrayList<>();
        PageRequest pageable = PageRequest.of(page, length);
        lentRepository.findAllOverdueLent(now, pageable).stream().map(
                (lh) -> {
                    String userName = userRepository.findNameById(lh.getUserId());
                    Optional<Location> location = cabinetRepository.findLocationById(
                            lh.getCabinetId());
                    return overdueList.add(
                            cabinetMapper.toOverdueUserCabinetDto(lh, userName, location));
                }
        );
        return cabinetMapper.toOverdueUserCabinetPaginationDto(overdueList, overdueList.size());
    }
}
