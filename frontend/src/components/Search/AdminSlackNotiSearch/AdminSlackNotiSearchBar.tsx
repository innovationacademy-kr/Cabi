import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SlackChannels } from "@/assets/data/SlackAlarm";
import { axiosSearchByIntraId } from "@/api/axios/axios.custom";
import useOutsideClick from "@/hooks/useOutsideClick";
import SlackAlarmSearchBarList from "./AdminSlackNotiSearchBarList";

export interface ISlackChannel {
  title: string;
  channelId: string;
}
// TODO : 위치 옮기기

// TODO : 리팩토링
// TODO : import

const AdminSlackNotiSearchBar = ({
  searchInput,
  renderReceiverInput,
}: {
  searchInput: React.RefObject<HTMLInputElement>;
  renderReceiverInput: (title: string) => void;
}) => {
  const navigate = useNavigate();
  const [searchListById, setSearchListById] = useState<any[]>([]);
  const [searchListByChannel, setSearchListByChannel] = useState<
    ISlackChannel[]
  >([]);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [onFocus, setOnFocus] = useState<boolean>(true);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [floor, setFloor] = useState<number>(0);

  const resetSearchState = () => {
    setSearchListById([]);
    setSearchListByChannel([]);
    setTotalLength(0);
    setTargetIndex(-1);
    setFloor(0);
    if (searchInput.current) {
      searchInput.current.value = "";
      setSearchValue("");
    }
  };

  const clickSearchButton = () => {
    if (searchInput.current) {
      const searchValue = searchInput.current.value;
      if (searchValue.length <= 0) {
        resetSearchState();
        return alert("검색어를 입력해주세요.");
      } else if (isNaN(Number(searchValue)) && searchValue.length <= 1) {
        resetSearchState();
        return alert("두 글자 이상의 검색어를 입력해주세요.");
      }
      // TODO : search bar list item 선택됐을때 엔터눌렀을때
    }
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const typeSearchInput = async () => {
    if (searchInput.current) {
      setSearchValue(searchInput.current.value);
      const searchValue = searchInput.current.value;
      if (searchValue.length <= 0) {
        setSearchListById([]);
        setSearchListByChannel([]);
        setTotalLength(0);
        setTargetIndex(-1);
        return;
      }
      if (searchInput.current!.value[0] === "#") {
        // slack channel 검색
        if (searchValue.length <= 1) {
          setSearchListByChannel([]);
          setTotalLength(0);
          setTargetIndex(-1);
        } else {
          const searchResult = SlackChannels.filter((SlackChannels) => {
            return SlackChannels.title.includes(searchValue);
          });
          setSearchListById([]);
          setSearchListByChannel(searchResult);
          setTotalLength(searchResult.length);
        }
      } else {
        // intra_ID 검색
        if (searchValue.length <= 1) {
          setSearchListById([]);
          setTotalLength(0);
          setTargetIndex(-1);
        } else {
          const searchResult = await axiosSearchByIntraId(searchValue);
          setSearchListByChannel([]);
          setSearchListById(searchResult.data.result);
          setTotalLength(searchResult.data.totalLength);
        }
      }
    }
  };

  // outside click
  useOutsideClick(searchInput, () => {
    setOnFocus(false);
  });

  const valueChangeHandler = () => {
    if (searchInput.current!.value[0] === "#") {
      return searchListByChannel[targetIndex].title;
    } else return searchListById[targetIndex].name;
  };

  // searchInput value change
  useEffect(() => {
    if (targetIndex !== -1) {
      searchInput.current!.value = valueChangeHandler();
      setSearchValue(searchInput.current!.value);
    }
  }, [targetIndex]);

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      clickSearchButton();
    } else if (e.key == "ArrowUp") {
      if (totalLength > 0) {
        setTargetIndex((prev) =>
          prev > 0
            ? prev - 1
            : Math.max(searchListById.length, searchListByChannel.length) - 1
        );
      }
    } else if (e.key == "ArrowDown") {
      if (totalLength > 0) {
        setTargetIndex((prev) =>
          prev < Math.max(searchListById.length, searchListByChannel.length) - 1
            ? prev + 1
            : 0
        );
      }
    }
  };
  return (
    <>
      <SearchBarStyled>
        <FormInputStyled
          placeholder="#입력 시 채널 검색"
          ref={searchInput}
          type="text"
          onFocus={() => {
            setOnFocus(true);
          }}
          onChange={debounce(typeSearchInput, 300)}
          onKeyDown={handleInputKey}
        />
      </SearchBarStyled>
      {onFocus && searchInput.current?.value && totalLength > 0 && (
        <>
          <SlackAlarmSearchBarList
            searchListById={searchListById}
            searchListByChannel={searchListByChannel}
            searchWord={searchValue}
            targetIndex={targetIndex}
            renderReceiverInput={renderReceiverInput}
          />
        </>
      )}
    </>
  );
};

const SearchBarStyled = styled.div`
  position: relative;
  width: 100%;
`;

const FormInputStyled = styled.input`
  width: 100%;
  height: 40px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  :focus {
    border: 1px solid var(--main-color);
  }
  text-align: left;
  padding: 0 10px;
  ::placeholder {
    color: var(--line-color);
  }
`;

export default AdminSlackNotiSearchBar;
