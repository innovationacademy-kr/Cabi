import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

const ContentSection = styled.section`
  height: 90vh;
  width: 90vw;
  max-width: 25rem;
  text-align: center;
`;

const ContentTemplate = ({ children }: PropsWithChildren): JSX.Element => {
  return <ContentSection id="content">{children}</ContentSection>;
};

export default ContentTemplate;
