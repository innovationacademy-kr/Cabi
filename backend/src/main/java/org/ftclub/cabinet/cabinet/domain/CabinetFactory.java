package org.ftclub.cabinet.cabinet.domain;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CabinetFactory {

    private final CabinetRepository cabinetRepository;

    public Cabinet createCabinet(Integer VisibleNum, CabinetStatus status, LentType lentType,
            Integer maxUser, String status_note, Grid grid, String title, String memo,
            Long cabinetPlaceId) {
        final Long cabinetId = cabinetRepository.getNextCabinetId();
        return new Cabinet();
    }
}

//public class CargoFactory {
//    private final LocationRepository locationRepository;
//    private final CargoRepository cargoRepository;
//
//    public CargoFactory(LocationRepository locationRepository, CargoRepository cargoRepository) {
//        this.locationRepository = locationRepository;
//        this.cargoRepository = cargoRepository;
//    }
//
//    public Cargo createCargo(UnLocode originUnLoCode, UnLocode destinationUnLoCode, Instant arrivalDeadline) {
//        final TrackingId trackingId = cargoRepository.nextTrackingId();
//        final Location origin = locationRepository.find(originUnLoCode);
//        final Location destination = locationRepository.find(destinationUnLoCode);
//        final RouteSpecification routeSpecification = new RouteSpecification(origin, destination, arrivalDeadline);
//
//        return new Cargo(trackingId, routeSpecification);
//    }
