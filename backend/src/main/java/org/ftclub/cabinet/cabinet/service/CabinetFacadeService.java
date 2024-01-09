package org.ftclub.cabinet.cabinet.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.*;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.AVAILABLE;
import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.PENDING;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class CabinetFacadeService {

    private final CabinetCommandService cabinetCommandService;
    private final CabinetQueryService cabinetQueryService;

    private final LentQueryService lentQueryService;
    private final LentRedisService lentRedisService;
    private final UserQueryService userQueryService;

    private final CabinetMapper cabinetMapper;
    private final LentMapper lentMapper;

    /**
     * {@inheritDoc}
     * <p>
     * 존재하는 모든 건물들을 가져오고, 각 건물별 층 정보들을 가져옵니다.
     */
    @Transactional(readOnly = true)
    public List<BuildingFloorsDto> getBuildingFloorsResponse() {
        List<String> allBuildings = cabinetQueryService.findAllBuildings();
        return allBuildings.stream()
                .map(building -> cabinetMapper.toBuildingFloorsDto(building,
                        cabinetQueryService.findAllFloorsByBuilding(building))
                )
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc} 사물함 id로 사물함 정보를 가져옵니다. active 대여기록이 없는경우, IN_SESSION 상태의 사물함인지 확인합니다.
     */
    public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
        Cabinet cabinet = cabinetQueryService.findCabinet(cabinetId);
        List<LentHistory> cabinetActiveLentHistories = lentQueryService.findCabinetActiveLentHistories(
                cabinetId);
        List<LentDto> lentDtos = cabinetActiveLentHistories.stream()
                .map(lentHistory -> lentMapper.toLentDto(lentHistory.getUser(), lentHistory))
                .collect(Collectors.toList());

        if (lentDtos.isEmpty()) {
            List<Long> usersInCabinet = lentRedisService.findUsersInCabinet(cabinetId);
            List<User> users = userQueryService.getUsers(usersInCabinet);
            users.forEach(user -> lentDtos.add(
                    LentDto.builder().userId(user.getId()).name(user.getName()).build()
            ));
        }
        LocalDateTime sessionExpiredAt = lentRedisService.getSessionExpired(cabinetId);

        return cabinetMapper.toCabinetInfoResponseDto(cabinet, lentDtos, sessionExpiredAt);
    }

    /**
     * @param visibleNum
     * @return
     */

    public CabinetSimplePaginationDto getCabinetsSimpleInfoByVisibleNum(Integer visibleNum) {
        List<Cabinet> cabinets = cabinetQueryService.findCabinets(visibleNum);

        List<CabinetSimpleDto> cabinetSimpleDtos = cabinets.stream()
                .map(cabinetMapper::toCabinetSimpleDto)
                .collect(Collectors.toList());

        return CabinetSimplePaginationDto.builder()
                .totalLength((long) cabinets.size())
                .result(cabinetSimpleDtos)
                .build();
    }


    /**
     * 빌딩명과 층으로 섹션별 사물함 정보를 가져옵니다.
     *
     * @param building 빌딩 이름 (예: 새롬관)
     * @param floor    빌딩에 있는 층
     * @return 전달인자로 받은 건물,층 에 있는 모든 섹션별 사물함 정보
     */
    @Transactional(readOnly = true)
    public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
                                                                     Integer floor) {
        List<ActiveCabinetInfoEntities> activeCabinetInfos = cabinetQueryService.findActiveCabinetInfoEntities(
                building, floor);
        Map<Cabinet, List<LentHistory>> cabinetLentHistories = activeCabinetInfos.stream().
                collect(groupingBy(ActiveCabinetInfoEntities::getCabinet,
                        mapping(ActiveCabinetInfoEntities::getLentHistory,
                                Collectors.toList())));
        List<Cabinet> allCabinetsOnSection =
                cabinetQueryService.findAllCabinetsByBuildingAndFloor(building, floor);

        Map<String, List<CabinetPreviewDto>> cabinetPreviewsBySection = new LinkedHashMap<>();
        allCabinetsOnSection.stream()
                .sorted(Comparator.comparing(Cabinet::getVisibleNum))
                .forEach(cabinet -> {
                    String section = cabinet.getCabinetPlace().getLocation().getSection();
                    List<LentHistory> lentHistories =
                            cabinetLentHistories.getOrDefault(cabinet, Collections.emptyList());
                    String title = checkCabinetTitle(cabinet, lentHistories);
                    cabinetPreviewsBySection.computeIfAbsent(section, k -> new ArrayList<>())
                            .add(cabinetMapper.toCabinetPreviewDto(cabinet, lentHistories.size(),
                                    title));
                });

        return cabinetPreviewsBySection.entrySet().stream()
                .map(entry -> cabinetMapper.toCabinetsPerSectionResponseDto(entry.getKey(),
                        entry.getValue()))
                .collect(Collectors.toList());
    }

    private String checkCabinetTitle(Cabinet cabinet, List<LentHistory> lentHistories) {
        if (cabinet.getTitle() != null && !cabinet.getTitle().isEmpty()) {
            return cabinet.getTitle();
        } else if (!lentHistories.isEmpty() && lentHistories.get(0).getUser() != null) {
            return lentHistories.get(0).getUser().getName();
        }
        return null;
    }

    @Transactional
    public CabinetPendingResponseDto getPendingCabinets(String building) {
        final LocalDate yesterday = LocalDateTime.now().minusDays(1).toLocalDate();
        List<Cabinet> pendingCabinets =
                cabinetQueryService.findPendingCabinetsNotLentTypeAndStatus(
                        building, LentType.CLUB, List.of(AVAILABLE, PENDING));
        List<Long> cabinetIds = pendingCabinets.stream()
                .filter(cabinet -> cabinet.isStatus(PENDING))
                .map(Cabinet::getId).collect(Collectors.toList());
        Map<Integer, List<CabinetPreviewDto>> cabinetFloorMap =
                cabinetQueryService.findAllFloorsByBuilding(building).stream()
                        .collect(toMap(key -> key, value -> new ArrayList<>()));
        Map<Long, List<LentHistory>> lentHistoriesMap =
                lentQueryService.findAllByCabinetIdsAfterDate(yesterday, cabinetIds)
                        .stream().collect(groupingBy(LentHistory::getCabinetId));
        pendingCabinets.forEach(cabinet -> {
            Integer floor = cabinet.getCabinetPlace().getLocation().getFloor();
            if (cabinet.isStatus(AVAILABLE)) {
                cabinetFloorMap.get(floor).add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
            }
            if (cabinet.isStatus(PENDING)) {
                LocalDateTime latestEndedAt = lentHistoriesMap.get(cabinet.getId()).stream()
                        .map(LentHistory::getEndedAt)
                        .max(LocalDateTime::compareTo).orElse(null);
                if (latestEndedAt != null && latestEndedAt.toLocalDate().isEqual(yesterday)) {
                    cabinetFloorMap.get(floor)
                            .add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
                }
            }
        });
        return cabinetMapper.toCabinetPendingResponseDto(cabinetFloorMap);
    }

    public CabinetPaginationDto getCabinetPaginationByLentType(LentType lentType,
                                                               Pageable pageable) {
        Page<Cabinet> cabinets = cabinetQueryService.findAllByLentType(lentType, pageable);
        List<CabinetDto> result = cabinets.stream()
                .map(cabinetMapper::toCabinetDto).collect(Collectors.toList());
        return cabinetMapper.toCabinetPaginationDtoList(result, cabinets.getTotalElements());
    }

    public CabinetPaginationDto getCabinetPaginationByStatus(CabinetStatus status,
                                                             Pageable pageable) {
        Page<Cabinet> cabinets = cabinetQueryService.findAllByStatus(status, pageable);
        List<CabinetDto> result = cabinets.stream()
                .map(cabinetMapper::toCabinetDto).collect(Collectors.toList());
        return cabinetMapper.toCabinetPaginationDtoList(result, cabinets.getTotalElements());
    }

    public CabinetPaginationDto getCabinetPaginationByVisibleNum(Integer visibleNum,
                                                                 Pageable pageable) {
        Page<Cabinet> cabinets = cabinetQueryService.findAllByVisibleNum(visibleNum, pageable);
        List<CabinetDto> result = cabinets.stream()
                .map(cabinetMapper::toCabinetDto).collect(Collectors.toList());
        return cabinetMapper.toCabinetPaginationDtoList(result, cabinets.getTotalElements());
    }

    public LentHistoryPaginationDto getLentHistoryPagination(Long cabinetId, Pageable pageable) {
        Page<LentHistory> lentHistories = lentQueryService.findCabinetLentHistoriesWithUserAndCabinet(
                cabinetId, pageable);
        List<LentHistoryDto> result = lentHistories.stream()
                .sorted(Comparator.comparing(LentHistory::getStartedAt).reversed())
                .map(lh -> lentMapper.toLentHistoryDto(lh, lh.getUser(), lh.getCabinet()))
                .collect(Collectors.toList());
        return lentMapper.toLentHistoryPaginationDto(result, lentHistories.getTotalElements());
    }

    /*--------------------------------------------CUD--------------------------------------------*/

    /**
     * Admin에서 사용되는, 사물함의 상태 노트 변경
     *
     * @param cabinetId  변경할 cabinet ID
     * @param statusNote 변경할 상태 메모
     */
    @Transactional
    public void updateCabinetStatusNote(Long cabinetId, String statusNote) {
        Cabinet cabinet = cabinetQueryService.findCabinet(cabinetId);
        cabinetCommandService.changeCabinetStatusNote(cabinet, statusNote);
    }


    /**
     * 사물함의 제목을 변경합니다
     *
     * @param cabinetId 변경할 사물함 ID
     * @param title     변경할 사물함 제목
     */
    @Transactional
    public void updateCabinetTitle(Long cabinetId, String title) {
        Cabinet cabinet = cabinetQueryService.findCabinet(cabinetId);
        cabinetCommandService.updateTitle(cabinet, title);
    }

    @Transactional
    public void updateCabinetGrid(Long cabinetId, Integer row, Integer col) {
        Cabinet cabinet = cabinetQueryService.findCabinet(cabinetId);
        cabinetCommandService.updateGrid(cabinet, Grid.of(row, col));
    }

    /**
     * 사물함의 번호를 변경합니다.
     *
     * @param cabinetId  변경할 사물함 ID
     * @param visibleNum 변경할 visibleNum
     */
    @Transactional
    public void updateCabinetVisibleNum(Long cabinetId, Integer visibleNum) {
        Cabinet cabinet = cabinetQueryService.findCabinet(cabinetId);
        cabinetCommandService.updateVisibleNum(cabinet, visibleNum);
    }

    /**
     * @param cabinetStatusRequestDto 변경할 사물함들의 ID, 상태 Bundle
     */
    @Transactional
    public void updateCabinetBundleStatus(CabinetStatusRequestDto cabinetStatusRequestDto) {
        CabinetStatus status = cabinetStatusRequestDto.getStatus();
        LentType lentType = cabinetStatusRequestDto.getLentType();

        List<Cabinet> cabinetsWithLock = cabinetQueryService.findCabinetsWithLock(
                cabinetStatusRequestDto.getCabinetIds());

        for (Cabinet cabinet : cabinetsWithLock) {
            if (status != null) {
                cabinetCommandService.updateStatus(cabinet, cabinetStatusRequestDto.getStatus());
            }
            if (lentType != null) {
                cabinetCommandService.updateLentType(cabinet,
                        cabinetStatusRequestDto.getLentType());
            }
        }
    }

    /**
     * 사물함에 동아리 유저를 대여 시킵니다. {inheritDoc}
     *
     * @param dto 변경하려는 동아리 정보 dto
     */
    @Transactional
    public void updateClub(CabinetClubStatusRequestDto dto) {
        Cabinet cabinet = cabinetQueryService.getUserActiveCabinetWithLock(dto.getCabinetId());

        Cabinet activeCabinetByUserId = cabinetQueryService.findActiveCabinetByUserId(
                dto.getUserId());
        if (activeCabinetByUserId != null) {
            throw new ServiceException(ExceptionStatus.LENT_ALREADY_EXISTED);
        }

        String clubName = "";
        if (dto.getUserId() != null) {
            clubName = userQueryService.getUser(dto.getUserId()).getName();
        }

        cabinetCommandService.updateClubStatus(cabinet, clubName, dto.getStatusNote());
    }

    @Transactional
    public void updateStatus(Long cabinetId, CabinetStatus status) {
        if (!status.isValid()) {
            throw new ServiceException(ExceptionStatus.INVALID_STATUS);
        }
        Cabinet cabinet = cabinetQueryService.findCabinetsWithLock(cabinetId);
        cabinet.specifyStatus(status);
    }

}
