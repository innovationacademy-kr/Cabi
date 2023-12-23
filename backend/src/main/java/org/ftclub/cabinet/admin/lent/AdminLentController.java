package org.ftclub.cabinet.admin.lent;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.ReturnCabinetsRequestDto;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin")
@Log4j2
public class AdminLentController {
	private final AdminLentFacadeService adminLentFacadeService;

	@PatchMapping("/return-cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public void terminateLentCabinets(
			@Valid @RequestBody ReturnCabinetsRequestDto returnCabinetsRequestDto) {
		log.info("Called terminateLentCabinets returnCabinetsRequestDto={}",
				returnCabinetsRequestDto);
		adminLentFacadeService.endCabinetLent(returnCabinetsRequestDto.getCabinetIds());
	}

	@PatchMapping("/return-users/{userId}")
	@AuthGuard(level = ADMIN_ONLY)
	public void terminateLentUser(@PathVariable("userId") Long userId) {
		log.info("Called terminateLentUser userId={}", userId);
		adminLentFacadeService.endUserLent(userId);
	}
}
