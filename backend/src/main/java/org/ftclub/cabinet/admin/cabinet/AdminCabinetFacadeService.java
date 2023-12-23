package org.ftclub.cabinet.admin.cabinet;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminCabinetFacadeService {
	private final CabinetQueryService cabinetQueryService;

	private final CabinetMapper cabinetMapper;


}
