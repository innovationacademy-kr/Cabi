package org.ftclub.cabinet.cabinet.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CabinetService를 위한 ExceptionService
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class CabinetOptionalFetcher {

    private final CabinetRepository cabinetRepository;

    /*-------------------------------------------FIND-------------------------------------------*/

    public Cabinet findCabinet(Long cabinetId) {
        log.info("Called findCabinet: {}", cabinetId);
        return cabinetRepository.findById(cabinetId).orElse(null);
    }

    /**
     * 유저 ID로 사물함을 찾습니다.
     *
     * @param userId 유저ID
     * @return 사물함 엔티티
     * @throws ServiceException 사물함을 찾을 수 없는 경우
     */
    public Cabinet findLentCabinetByUserId(Long userId) {
        log.info("Called findLentCabinetByUserId: {}", userId);
        return cabinetRepository.findLentCabinetByUserId(userId).orElse(null);
    }

    public List<String> findAllBuildings() {
        log.info("Called findAllBuildings");
        return cabinetRepository.findAllBuildings();
    }

    public List<Integer> findAllFloorsByBuilding(String building) {
        log.info("Called findAllFloorsByBuilding: {}", building);
        return cabinetRepository.findAllFloorsByBuilding(building);
    }

    public List<String> findAllSectionsByBuildingAndFloor(String building, Integer floor) {
        log.info("Called findAllSectionsByBuildingAndFloor: {}, {}", building, floor);
        return cabinetRepository.findAllSectionsByBuildingAndFloor(building, floor);
    }

    public List<Long> findAllCabinetIdsBySection(Integer floor, String section) {
        log.info("Called findAllCabinetIdsBySection: {}, {}", floor, section);
        return cabinetRepository.findAllCabinetIdsBySection(floor, section);
    }

    /*-------------------------------------------GET--------------------------------------------*/

    /**
     * 사물함 ID로 변경 사항이 예정된 사물함을 찾습니다.
     * <p>
     * X Lock을 획득한 상태로 가져옵니다.
     *
     * @param cabinetId 사물함 ID
     * @return 사물함 엔티티
     * @throws ServiceException 사물함을 찾을 수 없는 경우
     */
    public Cabinet getCabinetForUpdate(Long cabinetId) {
        log.info("Called getCabinetForUpdate: {}", cabinetId);
        return cabinetRepository.findByIdForUpdate(cabinetId)
                .orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
    }

    /**
     * 사물함 ID로 사물함을 찾습니다.
     *
     * @param cabinetId 사물함 ID
     * @return 사물함 엔티티
     * @throws ServiceException 사물함을 찾을 수 없는 경우
     */
    public Cabinet getCabinet(Long cabinetId) {
        log.info("Called getCabinet: {}", cabinetId);
        return cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
    }

    /**
     * 유저 ID로 사물함을 찾습니다.
     *
     * @param userId 유저ID
     * @return 사물함 엔티티
     * @throws ServiceException 사물함을 찾을 수 없는 경우
     */
    public Cabinet getLentCabinetByUserId(Long userId) {
        log.info("Called getLentCabinetByUserId: {}", userId);
        return cabinetRepository.findLentCabinetByUserId(userId)
                .orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
    }

    /**
     * 사물함 ID로 동아리 사물함을 찾습니다.
     *
     * @param cabinetId 사물함 ID
     * @return 동아리 사물함 엔티티
     * @throws ServiceException 사물함을 찾을 수 없는 경우
     */
    public Cabinet getClubCabinet(Long cabinetId) {
        log.info("Called getClubCabinet: {}", cabinetId);
        Cabinet cabinet = getCabinet(cabinetId);
        if (!cabinet.isLentType(LentType.CLUB)) {
            throw new ServiceException(ExceptionStatus.NOT_FOUND_CABINET);
        }
        return cabinet;
    }

    /**
     * 사물함 ID로 위치(빌딩, 층, 섹션) 정보를 찾습니다.
     *
     * @param cabinetId 사물함 ID
     * @return 위치 엔티티
     * @throws ServiceException 사물함을 찾을 수 없는 경우
     */
    public Location getLocation(Long cabinetId) {
        log.info("Called getLocation: {}", cabinetId);
        return cabinetRepository.findLocationById(cabinetId)
                .orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
    }

    public Page<Cabinet> findPaginationByLentType(LentType lentType, PageRequest pageable) {
        log.info("Called findPaginationByLentType: {}", lentType);
        return cabinetRepository.findPaginationByLentType(lentType, pageable);
    }

    public Page<Cabinet> findPaginationByStatus(CabinetStatus status, PageRequest pageable) {
        log.info("Called findPaginationByStatus: {}", status);
        return cabinetRepository.findPaginationByStatus(status, pageable);
    }

    public Page<Cabinet> findPaginationByVisibleNum(Integer visibleNum, PageRequest pageable) {
        log.info("Called findPaginationByVisibleNum: {}", visibleNum);
        return cabinetRepository.findPaginationByVisibleNum(visibleNum, pageable);
    }

    public List<Cabinet> findAllCabinetsByLocation(Location location) {
        log.info("Called findAllCabinetsByLocation: {}", location);
        return cabinetRepository.findAllCabinetsByLocation(location);
    }
}
