import { useEffect, useState } from "react";
import styled from "styled-components";
import SlackNotiSearchBarList from "@/Cabinet/components/SlackNoti/SlackNotiSearchBarList";
import { ISlackChannel, SlackChannels } from "@/Cabinet/assets/data/SlackAlarm";
import { axiosSearchByIntraId } from "@/Cabinet/api/axios/axios.custom";
import useDebounce from "@/Cabinet/hooks/useDebounce";
import useOutsideClick from "@/Cabinet/hooks/useOutsideClick";

const SlackNotiSearchBar = ({
  searchInput,
  renderReceiverInput,
}: {
  searchInput: React.RefObject<HTMLInputElement>;
  renderReceiverInput: (title: string) => void;
}) => {
  const [searchListById, setSearchListById] = useState<any[]>([]);
  const [searchListByChannel, setSearchListByChannel] = useState<
    ISlackChannel[]
  >([]);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [onFocus, setOnFocus] = useState<boolean>(true);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>("");
  const { debounce } = useDebounce();

  const typeSearchInput = async () => {
    if (searchInput.current) {
      const searchValue = searchInput.current.value;
      setSearchValue(searchValue);
      if (searchValue.length <= 0) {
        setSearchListById([]);
        setSearchListByChannel([]);
        setTotalLength(0);
        setTargetIndex(-1);
        return;
      }
      if (searchInput.current!.value[0] === "#") {
        // slack channel 검색
        if (searchValue.length <= 0) {
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
      if (targetIndex !== -1) {
        searchInput.current!.value = valueChangeHandler();
        setSearchValue(searchInput.current!.value);
        setTotalLength(0);
      }
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
      <SearchBarWrapStyled>
        <FormInputStyled
          placeholder="#입력 시 채널 검색"
          ref={searchInput}
          type="text"
          onFocus={() => {
            setOnFocus(true);
          }}
          onChange={() => debounce("slackNotiSearch", typeSearchInput, 300)}
          onKeyDown={handleInputKey}
        />
        {onFocus && searchInput.current?.value && totalLength > 0 && (
          <>
            <SlackNotiSearchBarList
              searchListById={searchListById}
              searchListByChannel={searchListByChannel}
              searchWord={searchValue}
              targetIndex={targetIndex}
              renderReceiverInput={renderReceiverInput}
            />
          </>
        )}
      </SearchBarWrapStyled>
    </>
  );
};

const SearchBarWrapStyled = styled.div`
  position: relative;
`;

const FormInputStyled = styled.input`
  width: 100%;
  height: 40px;
  background-color: var(--card-content-bg-color);
  border-radius: 8px;
  border: 1px solid var(--capsule-btn-border-color);
  :focus {
    border: 1px solid var(--sys-main-color);
  }
  text-align: left;
  padding: 0 10px;
  ::placeholder {
    color: var(--toggle-switch-off-bg-color);
  }
`;

export default SlackNotiSearchBar;
