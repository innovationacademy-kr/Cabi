package org.ftclub.cabinet.lent.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.cabinet.newService.CabinetQueryService;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.newService.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LentFacadeService {

    private final LentQueryService lentQueryService;
    private final LentCommandService lentCommandService;
    private final UserQueryService userQueryService;
    private final CabinetQueryService cabinetQueryService;

    private final LentMapper lentMapper;


    public LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page, Integer size) {
        log.debug("Called getAllUserLentHistories: {}", userId);
        userQueryService.getUser(userId);

        if (size <= 0) {
            size = Integer.MAX_VALUE;
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by("startedAt"));
        Page<LentHistory> lentHistories = lentQueryService.findUserLentHistories(userId, pageable);
        List<LentHistoryDto> result = lentHistories.stream()
                .map(lh -> lentMapper.toLentHistoryDto(lh, lh.getUser(), lh.getCabinet()))
                .collect(Collectors.toList());
        return lentMapper.toLentHistoryPaginationDto(result, lentHistories.getTotalElements());
    }

    public List<LentDto> getLentDtoList(Long cabinetId) {
        log.debug("Called getLentDtoList: {}", cabinetId);
        cabinetQueryService.getCabinet(cabinetId);
        lentQueryService.findCabinetActiveLentHistory(cabinetId);
//        cabinetOptionalFetcher.getCabinet(cabinetId);
//        List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentByCabinetId(
//                cabinetId);
//        return lentHistories.stream().map(
//                e -> lentMapper.toLentDto(e.getUser(), e)).collect(Collectors.toList());
//		return lentHistories.stream()
//				.map(e -> new LentDto(
//						e.getUserId(),
//						e.getUser().getName(),
//						e.getLentHistoryId(),
//						e.getStartedAt(),
//						e.getExpiredAt()))
//				.collect(Collectors.toList());
    }
}
