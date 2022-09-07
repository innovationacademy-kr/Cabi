import MenualModal from "../../modal/MenualModal";
import axios from "axios";
import { axiosLogout } from "../../network/axios/axios.custom";
import { useNavigate } from "react-router-dom";
import styled from '@emotion/styled';

// import "./MenuButton.css";

const DropdownOpenButton = styled.button`
  &:hover, &:active:focus {
	outline: 0px;
	outline-offset: 0px;
  }
`;

const DropdownMenu = styled.div`
	#dropdownMenuReturn {
		text-align: center;
		max-width: 2rem;
		right: 0%;
		left: auto;
	}

	#dropdownMenuLent {
		text-align: center;
		max-width: 2rem;
		right: 0%;
		left: auto !important;
	}
`;

interface MenuProps {
  url: string;
}

export default function MenuButton(props: MenuProps) {
	const navigate = useNavigate();

  const handleClick = () => {
    axiosLogout()
      .then((res) => navigate("/"))
      .catch((error) => console.error(error));
  };
  const cabinetPage = () => {
    if (props.url === "/return") {
      return "내 사물함";
    } else {
      return "전체 사물함";
    }
  };
  const dropdown = () => {
    if (props.url === "/lent") {
      return "dropdownMenuReturn";
    } else {
      return "dropdownMenuLent";
    }
  };

	return (
		<div className="dropdown text-right" id="menu">
			<DropdownOpenButton
				className="btn"
				type="button"
				id="dropdownOpenButton"
				data-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded="false"
			>
				<i className="h2 bi bi-list"></i>
			</DropdownOpenButton>
			<DropdownMenu
				className="dropdown-menu"
				id={dropdown()}
				aria-labelledby="dropdownOpenButton"
			>
				<a className="dropdown-item" href={props.url}>
					{cabinetPage()}
				</a>
				<a
					className="dropdown-item"
					data-bs-toggle="modal"
					data-bs-target="#menualmodal"
				>
					이용안내
				</a>
				<a
					className="dropdown-item"
					href="https://42born2code.slack.com/archives/C02V6GE8LD7"
					target="_blank"
				>
					슬랙문의
				</a>
				{/* <a className="dropdown-item" href="#">대여 로그</a> */}
				<a className="dropdown-item" onClick={handleClick}>
					로그아웃
				</a>
			</DropdownMenu>
			<MenualModal></MenualModal>
		</div>
	)
}