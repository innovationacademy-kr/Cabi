import { useNavigate } from 'react-router-dom';

export default function HomeButton () {
	const navigate = useNavigate();

	const handleHome = () => {
		navigate(0);
	};

	return (<img src="../img/cabinet.ico" onClick={handleHome} width="30" />)
}