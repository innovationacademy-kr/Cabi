import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userInfo } from "./Main";
import "./main.css";

export type eventInfo = {
	event_id: number,
	event_name: string,
	intra_id: string,
	isEvent: boolean
};

export default function Event() {
	const handleLent = (e: any) => {
		axios.post('/api/event/lent').then((res) => {
			console.log(res.data);
		});
	}

	const handleCheck = (e: any) => {
		axios.get('/api/event/list').then((res) => {
			console.log(res.data);
		});
	}

	const handleReturn = (e: any) => {
		axios.post('api/event/return').then((res) => {
			console.log(res.data);
		});
	}

  return (
    <div className="container">
		<button onClick={handleLent}>lent</button>
		<button onClick={handleCheck}>check</button>
		<button onClick={handleReturn}>return</button>
    </div>
  );
}
