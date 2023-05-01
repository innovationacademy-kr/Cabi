public interface CabinetService {

    //    void createNewCabinet(); optional parameters -> many overloading
//    void deleteCabinet(); optional parameters -> many overloading
    // void createNewLocation;
    CabinetDto getCabinetById(Long cabinetId);

    BuildingFloorsResponseDto getBuildingFloors();

    CabinetInfoResponseDto getCabinetInfo(Long cabinetId);

    List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building, Integer floor);

    void updateStatus(Long cabinetId, CabinetStatus status);

    void updateStatusByUserCount(Long cabinetId, Integer userCount);

    void updateMemoById(Long cabinetId, String memo);

    void updateTitleById(Long cabinetId, String title);

    void updateLocationById(Long cabinetId, Location location);

    void updateLentTyById(Long cabinetId, LentType lentType);

    void updateGridById(Long cabinetId, Grid grid);

    void updateStatusNoteById(Long cabinetId, String statusNote);

//      void createNewCabinetPlace(params...);
//      void deleteCabinetPlace(cabinetplaceId);

}