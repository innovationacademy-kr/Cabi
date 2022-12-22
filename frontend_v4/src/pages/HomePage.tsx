import MapInfoContainer from "@/containers/MapInfoContainer";
import { SectionPaginationContainer } from "@/containers/SectionPaginationContainer";
import TopNavContainer from "@/containers/TopNavContainer";

const HomePage = () => {
  return (
    <div>
      <TopNavContainer />
      <MapInfoContainer />
    </div>
  );
};

export default HomePage;
