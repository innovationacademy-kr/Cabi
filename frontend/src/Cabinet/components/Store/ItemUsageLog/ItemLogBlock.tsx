import styled from "styled-components";

export interface IItemUsageLog {
  dateStr?: string;
  date: Date;
  title: string;
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const ItemLogBlock = ({ log }: { log: IItemUsageLog }) => {
  return (
    <ItemUsageLogStyled>
      <IconBlockStyled>
        <log.logo />
      </IconBlockStyled>
      <ItemUsageInfoStyled>
        <ItemDateStyled>{formatDate(log.date)}</ItemDateStyled>
        <ItemTitleStyled>{log.title}</ItemTitleStyled>
      </ItemUsageInfoStyled>
    </ItemUsageLogStyled>
  );
};

const ItemUsageLogStyled = styled.div`
  margin-top: 10px;
  border-radius: 10px;
  height: 90px;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
`;

const IconBlockStyled = styled.div`
  display: flex;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: var(--main-color);
  justify-content: center;
  align-items: center;
  margin-left: 30px;
  margin-right: 20px;
  svg {
    width: 40px;
    height: 40px;
  }
`;

const ItemUsageInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

const ItemDateStyled = styled.div`
  font-size: 16px;
  word-spacing: -2px;
  color: var(--gray-color);
`;

const ItemTitleStyled = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

export default ItemLogBlock;
