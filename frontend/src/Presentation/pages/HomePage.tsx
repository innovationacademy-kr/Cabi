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
import { axiosGetPresentations } from "@/Presentation/api/axios/axios.custom";

const HomePage: React.FC = () => {
  const [presentations, setPresentations] = useState<IPresentation[]>([]);
  const [category, setCategory] = useState<string>("ALL");
  const [sortType, setSortType] = useState<string>("TIME");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(0);
  };

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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pb-8">
        <div className="w-full mb-6 mt-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2">
            <div className="w-full">
              <NavigationMenu>
                <NavigationMenuList className="flex w-full">
                  <NavigationMenuItem className="min-w-0">
                    <NavigationMenuLink
                      className={`
                        ${"min-w-0 px-3 py-2 rounded-md text-sm font-medium cursor-pointer text-center overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200"}
                        ${
                          category === "ALL"
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                      onClick={() => handleCategoryChange("ALL")}
                    >
                      전체
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  {Object.entries(PresentationCategoryTypeLabelMap).map(
                    ([name, label]) => (
                      <NavigationMenuItem key={name} className="min-w-0">
                        <NavigationMenuLink
                          className={`
                            ${"min-w-0 px-3 py-2 rounded-md text-sm font-medium cursor-pointer text-center overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200"}
                            ${
                              category === name
                                ? "bg-gray-200 text-gray-900"
                                : "text-gray-700 hover:bg-gray-50"
                            }
                          `}
                          onClick={() => handleCategoryChange(name)}
                        >
                          {label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0">
              <Select
                onValueChange={(value) => {
                  setSortType(value);
                  setCurrentPage(0);
                }}
                defaultValue={sortType}
              >
                <SelectTrigger className="w-[110px] bg-white">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="TIME">최신순</SelectItem>
                  <SelectItem value="LIKE">좋아요순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <PresentationCardContainer
            presentations={presentations}
            maxCols={3}
          />
        </div>
        <Pagination className="mt-8">
          <PaginationContent className="text-gray-500">
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
