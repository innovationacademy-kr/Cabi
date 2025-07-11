import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import PresentationCardContainer from "@/Presentation/pages/PresentationCardContainer";
import { IPresentation } from "@/Presentation/components/PresentationCard";
import { PresentationCategoryTypeLabelMap } from "@/Presentation/assets/data/maps";
import { ReactComponent as Banner } from "@/Presentation/assets/mainBanner.svg";
import { axiosGetPresentations } from "@/Presentation/api/axios.custom";

const HomePage: React.FC = () => {
  const [presentations, setPresentations] = useState<IPresentation[]>([]);
  const [category, setCategory] = useState<string>("ALL");
  const [sortType, setSortType] = useState<string>("TIME");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const response = await axiosGetPresentations(
          category,
          sortType,
          currentPage,
          6
        );
        setPresentations(response.data.content);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        console.error("Failed to fetch presentations:", error);
      }
    };

    fetchPresentations();
  }, [category, sortType, currentPage]);

  return (
    <>
      <div className="relative w-full">
        <Banner className="w-full h-auto block" />
        <div className="w-full h-[30px] bg-white" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex justify-between items-center mb-6 mt-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem key="ALL">
                <NavigationMenuLink
                  className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    category === "ALL"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setCategory("ALL")}
                >
                  전체
                </NavigationMenuLink>
              </NavigationMenuItem>
              {Object.entries(PresentationCategoryTypeLabelMap).map(
                ([name, label]) => (
                  <NavigationMenuItem key={name}>
                    <NavigationMenuLink
                      className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                        category === name
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setCategory(name)}
                    >
                      {label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <Select onValueChange={setSortType} defaultValue={sortType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TIME">최신순</SelectItem>
              <SelectItem value="LIKE">좋아요순</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center">
          <PresentationCardContainer presentations={presentations} />
        </div>
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index}
                  onClick={() => setCurrentPage(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default HomePage;
