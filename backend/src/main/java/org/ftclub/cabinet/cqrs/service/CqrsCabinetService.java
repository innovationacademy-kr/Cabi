package org.ftclub.cabinet.cqrs.service;

import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.AVAILABLE_CABINET;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.BUILDINGS;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.CABINET_INFO;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.CABINET_PER_SECTION;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.FLOORS;

import com.fasterxml.jackson.core.type.TypeReference;
import io.netty.util.internal.StringUtil;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.cqrs.domain.CqrsLockCollection;
import org.ftclub.cabinet.cqrs.respository.CqrsRedis;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetAvailableResponseDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

@Service
@Logging(level = LogLevel.DEBUG)
@RequiredArgsConstructor
public class CqrsCabinetService {

	private final CqrsRedis cqrsRedis;

	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;

	private final CqrsLockCollection cqrsLockCollection;


	//@formatter:off
	public void clearBuildingFloors() {
		synchronized (cqrsLockCollection.getLock(BUILDINGS)) {
			cqrsRedis.clearBySuffix(BUILDINGS.getValue());
		}
	}

	public List<BuildingFloorsDto> getBuildingFloors() {
		return cqrsRedis.get(BUILDINGS.getValue(),
				new TypeReference<List<BuildingFloorsDto>>() {});
	}

	public void addBuildingFloors(String building, List<Integer> floors) {
		String key = BUILDINGS.getValue();
		List<BuildingFloorsDto> buildingFloorsDtos =
				cqrsRedis.get(key, new TypeReference<List<BuildingFloorsDto>>() {});
		if (buildingFloorsDtos == null) {
			buildingFloorsDtos = new ArrayList<>();
		}

		buildingFloorsDtos.add(cabinetMapper.toBuildingFloorsDto(building, floors));
		synchronized (cqrsLockCollection.getLock(BUILDINGS)) {
			cqrsRedis.set(key, buildingFloorsDtos);
		}
	}

	public void clearFloors() {
		synchronized (cqrsLockCollection.getLock(FLOORS)) {
			cqrsRedis.clearBySuffix(FLOORS.getValue());
		}
	}

	public List<Integer> getFloors(String building) {
		return cqrsRedis.get(building + FLOORS.getValue(), new TypeReference<List<Integer>>() {});
	}

	public void addFloors(String building, List<Integer> floors) {
		synchronized (cqrsLockCollection.getLock(FLOORS)) {
			cqrsRedis.set(building + FLOORS.getValue(), floors);
		}
	}

	public void clearCabinetInfo() {
		synchronized (cqrsLockCollection.getLock(CABINET_INFO)) {
			cqrsRedis.clearBySuffix(CABINET_INFO.getValue());
		}
	}

	public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		return cqrsRedis.get(cabinetId + CABINET_INFO.getValue(),
				new TypeReference<CabinetInfoResponseDto>() {});
	}

	public void addCabinetInfo(Cabinet cabinet, LocalDateTime sessionExpiredAt) {
		String key = cabinet.getId() + CABINET_INFO.getValue();

		synchronized (cqrsLockCollection.getLock(CABINET_INFO)) {
			CabinetInfoResponseDto cabinetInfo =
					cqrsRedis.get(key, new TypeReference<CabinetInfoResponseDto>() {});
			if (cabinetInfo == null) {
				cabinetInfo = cabinetMapper.toCabinetInfoResponseDto(cabinet, new ArrayList<>(), null);
			} else {
				cabinetInfo.setLentType(cabinet.getLentType());
				cabinetInfo.setTitle(cabinet.getTitle());
				cabinetInfo.setStatus(cabinet.getStatus());
				cabinetInfo.setStatusNote(cabinet.getStatusNote());
				if (sessionExpiredAt != null) {
					cabinetInfo.setSessionExpiredAt(sessionExpiredAt);
				}
			}

			cqrsRedis.set(key, cabinetInfo);
		}
	}

	public void setSessionCabinetInfo(Long cabinetId, List<User> users, LocalDateTime expiredAt) {
		if (users.isEmpty()) {
			return;
		}
		String key = cabinetId + CABINET_INFO.getValue();
		List<LentDto> lentDtos = users.stream()
				.map(lentMapper::toLentDto).collect(Collectors.toList());

		synchronized (cqrsLockCollection.getLock(CABINET_INFO)) {
			CabinetInfoResponseDto cabinetInfo =
					cqrsRedis.get(key, new TypeReference<CabinetInfoResponseDto>() {});
			if (cabinetInfo == null) {
				throw ExceptionStatus.INVALID_ARGUMENT.asServiceException();
			}

			cabinetInfo.setLents(lentDtos);
			cabinetInfo.setSessionExpiredAt(expiredAt);
			cqrsRedis.set(key, cabinetInfo);
		}
	}

	private void addLentHistoryOnCabinetInfo(String key, LentDto lentDto) {
		synchronized (cqrsLockCollection.getLock(CABINET_INFO)) {
			CabinetInfoResponseDto cabinetInfo =
					cqrsRedis.get(key, new TypeReference<CabinetInfoResponseDto>() {});
			if (cabinetInfo == null) {
				throw ExceptionStatus.INVALID_ARGUMENT.asServiceException();
			}

			List<LentDto> lents = cabinetInfo.getLents();
			lents.removeIf(l -> l.getLentHistoryId().equals(lentDto.getLentHistoryId()));
			lents.add(lentDto);

			cqrsRedis.set(key, cabinetInfo);
		}
	}

	public void addClubLentHistoryOnCabinetInfo(ClubLentHistory clubLentHistory) {
		String key = clubLentHistory.getCabinetId() + CABINET_INFO.getValue();
		LentDto lentDto = lentMapper.toLentDto(clubLentHistory);
		this.addLentHistoryOnCabinetInfo(key, lentDto);
	}

	public void addLentHistoryOnCabinetInfo(LentHistory lentHistory) {
		String key = lentHistory.getCabinetId() + CABINET_INFO.getValue();
		LentDto lentDto = lentMapper.toLentDto(lentHistory.getUser(), lentHistory);
		this.addLentHistoryOnCabinetInfo(key, lentDto);
	}

	private void removeLentHistoryOnCabinetInfo(String key, Long lentHistoryId) {
		synchronized (cqrsLockCollection.getLock(CABINET_INFO)) {
			CabinetInfoResponseDto cabinetInfo =
					cqrsRedis.get(key, new TypeReference<CabinetInfoResponseDto>() {});
			if (cabinetInfo == null) {
				throw ExceptionStatus.INVALID_ARGUMENT.asServiceException();
			}

			List<LentDto> lents = cabinetInfo.getLents();
			lents.removeIf(l -> l.getLentHistoryId().equals(lentHistoryId));

			cqrsRedis.set(key, cabinetInfo);
		}
	}

	public void removeClubLentHistoryOnCabinetInfo(ClubLentHistory clubLentHistory) {
		String key = clubLentHistory.getCabinetId() + CABINET_INFO.getValue();
		this.removeLentHistoryOnCabinetInfo(key, clubLentHistory.getId());
	}

	public void removeLentHistoryOnCabinetInfo(LentHistory lentHistory) {
		String key = lentHistory.getCabinetId() + CABINET_INFO.getValue();
		this.removeLentHistoryOnCabinetInfo(key, lentHistory.getId());
	}

	public void clearAvailableCabinet() {
		synchronized (cqrsLockCollection.getLock(AVAILABLE_CABINET)) {
			cqrsRedis.clearBySuffix(AVAILABLE_CABINET.getValue());
		}
	}

	public CabinetAvailableResponseDto getAvailableCabinet(String building) {
		Map<Integer, List<CabinetPreviewDto>> availableCabinets =
				cqrsRedis.getHashEntries(building + AVAILABLE_CABINET.getValue(),
						new TypeReference<Integer>() {},
						new TypeReference<List<CabinetPreviewDto>>() {});
		return cabinetMapper.toCabinetAvailableResponseDto(availableCabinets);
	}

	public void addAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + AVAILABLE_CABINET.getValue();
		String floor = location.getFloor().toString();
		synchronized (cqrsLockCollection.getLock(AVAILABLE_CABINET)) {
			List<CabinetPreviewDto> availableCabinets =
					cqrsRedis.getHash(key, floor, new TypeReference<List<CabinetPreviewDto>>() {});
			if (availableCabinets == null) {
				availableCabinets = new ArrayList<>();
			}
			availableCabinets.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
			cqrsRedis.setHash(key, floor, availableCabinets);
		}
	}

	public void removeAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + AVAILABLE_CABINET.getValue();
		String floor = location.getFloor().toString();
		synchronized (cqrsLockCollection.getLock(AVAILABLE_CABINET)) {
			List<CabinetPreviewDto> availableCabinets =
					cqrsRedis.getHash(key, floor, new TypeReference<List<CabinetPreviewDto>>() {});
			availableCabinets.removeIf(c -> c.getCabinetId().equals(cabinet.getId()));
			cqrsRedis.setHash(key, floor, availableCabinets);
		}
	}

	public void clearCabinetPerSection() {
		synchronized (cqrsLockCollection.getLock(CABINET_PER_SECTION)) {
			cqrsRedis.clearBySuffix(CABINET_PER_SECTION.getValue());
		}
	}

	public List<CabinetsPerSectionResponseDto> getCabinetPerSection(String building, Integer floor) {
		Map<String,List<CabinetPreviewDto>> hashEntries =
				cqrsRedis.getHashEntries(building + floor.toString() + CABINET_PER_SECTION.getValue(),
						new TypeReference<List<CabinetPreviewDto>>() {});
		return hashEntries.entrySet().stream()
				.sorted(Comparator.comparing(e -> e.getValue().get(0).getVisibleNum()))
				.map(e -> cabinetMapper.toCabinetsPerSectionResponseDto(e.getKey(), e.getValue()))
				.collect(Collectors.toList());
	}

	public void addCabinetPerSection(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + location.getFloor() + CABINET_PER_SECTION.getValue();
		String section = location.getSection();

		synchronized (cqrsLockCollection.getLock(CABINET_PER_SECTION)) {
			List<CabinetPreviewDto> cabinetPreviewDtos = cqrsRedis.getHash(key, section,
					new TypeReference<List<CabinetPreviewDto>>() {});
			if (cabinetPreviewDtos == null) {
				cabinetPreviewDtos = new ArrayList<>();
			}

			CabinetPreviewDto cabinetPreviewDto = cabinetPreviewDtos.stream()
					.filter(c -> c.getCabinetId().equals(cabinet.getId()))
					.findFirst().orElse(null);
			CabinetPreviewDto newCabinet = cabinetMapper.toCabinetPreviewDto(cabinet,
					cabinetPreviewDto == null ? 0 : cabinetPreviewDto.getUserCount(),
					cabinetPreviewDto == null ? null : cabinetPreviewDto.getTitle());
			cabinetPreviewDtos.removeIf(c -> c.getCabinetId().equals(cabinet.getId()));
			cabinetPreviewDtos.add(newCabinet);
			cabinetPreviewDtos.sort(Comparator.comparing(CabinetPreviewDto::getVisibleNum));

			cqrsRedis.setHash(key, section, cabinetPreviewDtos);
		}
	}

	public void addLentHistoryOnCabinetPerSection(Cabinet cabinet, User user) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + location.getFloor() + CABINET_PER_SECTION.getValue();
		String section = location.getSection();

		synchronized (cqrsLockCollection.getLock(CABINET_PER_SECTION)) {
			List<CabinetPreviewDto> cabinetPreviewDtos = cqrsRedis.getHash(key, section,
							new TypeReference<List<CabinetPreviewDto>>() {});
			if (cabinetPreviewDtos == null) {
				throw ExceptionStatus.INVALID_ARGUMENT.asServiceException();
			}

			CabinetPreviewDto cabinetPreviewDto = cabinetPreviewDtos.stream()
					.filter(c -> c.getCabinetId().equals(cabinet.getId()))
					.findFirst().orElseThrow(ExceptionStatus.INVALID_ARGUMENT::asServiceException);
			cabinetPreviewDto.setUserCount(cabinetPreviewDto.getUserCount() + 1);
			cabinetPreviewDto.setName(user.getName());
			if (StringUtil.isNullOrEmpty(cabinetPreviewDto.getTitle())) {
				cabinetPreviewDto.setTitle(user.getName());
			}

			cqrsRedis.setHash(key, section, cabinetPreviewDtos);
		}
	}

	public void setSessionCabinetPerSection(Cabinet cabinet, List<User> users) {
		if (users.isEmpty()) {
			return;
		}
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + location.getFloor().toString();
		String section = location.getSection();

		synchronized (cqrsLockCollection.getLock(CABINET_PER_SECTION)) {
			List<CabinetPreviewDto> cabinetPreviewDtos = cqrsRedis.getHash(key, section,
					new TypeReference<List<CabinetPreviewDto>>() {});
			if (cabinetPreviewDtos == null) {
				cabinetPreviewDtos = new ArrayList<>();
			}

			CabinetPreviewDto cabinetPreviewDto = cabinetPreviewDtos.stream()
					.filter(c -> c.getCabinetId().equals(cabinet.getId()))
					.findFirst().orElse(null);
			if (cabinetPreviewDto == null) {
				cabinetPreviewDtos.add(
						cabinetMapper.toCabinetPreviewDto(cabinet, users.size(), users.get(0).getName()));
			} else {
				cabinetPreviewDto.setUserCount(users.size());
				if (StringUtil.isNullOrEmpty(cabinetPreviewDto.getName())) {
					cabinetPreviewDto.setName(users.get(0).getName());
				}
			}

			cqrsRedis.setHash(key, section, cabinetPreviewDtos);
		}
	}

	public void removeLentHistoryOnCabinetPerSection(Cabinet cabinet, User user) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + location.getFloor().toString() +
				CABINET_PER_SECTION.getValue();
		String section = location.getSection();

		synchronized (cqrsLockCollection.getLock(CABINET_PER_SECTION)) {
			List<CabinetPreviewDto> cabinetPreviewDtos = cqrsRedis.getHash(key, section,
					new TypeReference<List<CabinetPreviewDto>>() {});
			if (cabinetPreviewDtos == null) {
				throw ExceptionStatus.INVALID_ARGUMENT.asServiceException();
			}

			CabinetPreviewDto cabinetPreviewDto = cabinetPreviewDtos.stream()
					.filter(c -> c.getCabinetId().equals(cabinet.getId()))
					.findFirst().orElseThrow(ExceptionStatus.INVALID_ARGUMENT::asServiceException);
			cabinetPreviewDto.setUserCount(cabinetPreviewDto.getUserCount() -1);
			if (cabinetPreviewDto.getUserCount() == 0 ||
					cabinetPreviewDto.getTitle().equals(user.getName())) {
				cabinetPreviewDto.setTitle(null);
			}

			cqrsRedis.setHash(key, section, cabinetPreviewDtos);
		}
	}

	//@formatter:on
}
