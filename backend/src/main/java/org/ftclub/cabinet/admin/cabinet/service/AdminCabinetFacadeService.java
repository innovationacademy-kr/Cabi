package org.ftclub.cabinet.admin.cabinet.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminCabinetFacadeService {

	private final CabinetQueryService cabinetQueryService;

	private final CabinetMapper cabinetMapper;
}
