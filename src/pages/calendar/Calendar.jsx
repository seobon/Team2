import { useEffect, useState } from 'react';
import Todo from './Todo';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

export default function Calendar1() {
  const [today, setToday] = useState(new Date()); // 현재 날짜를 today에 저장
  const [writtenDays, setWrittenDays] = useState([]); // 작성된 날짜를 저장하는 상태
  const navigator = useNavigate();

  // 캘린더 조회
  useEffect(() => {
    const id = localStorage.getItem('id');
    const idNumber = Number(id);
    const month = today.getMonth() + 1;
    const monthString = month > 9 ? month : `0${month}`;

    // console.log('idNumber: ', idNumber); // 6
    // console.log('idNumber+idNumber:  ', idNumber + idNumber); // 12

    axios
      .get(`${process.env.REACT_APP_HOST}/diary/getCalendar?id=${id}&month=${monthString}`)
      .then(response => {
        if (response.data[0].diaryId != null) {
          setDiaryData(response.data); // 서버로부터 받은 데이터를 diaryData에 저장
          console.log('response.data: ', response.data);
          console.log('id: ', id);
          console.log('diaryId: ', response.data.diaryId);
          console.log('댔다!!');
          makeCalendar(response.data);
        } else {
          console.log('Failed to get the calendar data');
          console.log('response.data: ', response.data);
          console.log('id: ', id);
          console.log(month);
        }
      })
      .catch(error => {
        console.error('Error!', error);
      });
  }, []);

  // diaryData를 상태로 추가
  const [diaryData, setDiaryData] = useState(null);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const prevMonth = () => {
    setToday(new Date(today.getFullYear(), today.getMonth() - 1));
  };

  const nextMonth = () => {
    setToday(new Date(today.getFullYear(), today.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(today.getMonth(), today.getFullYear());
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  // 오늘 날짜
  const goToToday = () => {
    setToday(new Date());
  };

  useEffect(() => {
    if (diaryData) makeCalendar();
  }, [today, diaryData]);

  const [calendar, setCalendar] = useState([]);

  const makeCalendar = () => {
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    const calendarTemp = [];

    for (let i = 0; i < weekDays.length; i++) {
      calendarTemp.push(<div className="h-10 flex justify-center text-gray-900 font-Heading3">{weekDays[i]}</div>);
    }

    for (let i = 0; i < firstDay; i++) {
      calendarTemp.push(<div className=""></div>);
    }

    // 일
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i); // 연도, 월, 일
      const month = today.getMonth() + 1;

      let diaryId;
      let dateColor = 'bg-gray-200';
      let linkTo = '/write';

      for (const diary of diaryData) {
        if (!diary.createdAt) continue;

        const DiaryMonth = new Date(diary.createdAt).getMonth() + 1; // 작성월
        const DiaryDate = new Date(diary.createdAt).getDate(); // 작성일

        if (month === DiaryMonth) {
          if (i === DiaryDate) {
            diaryId = { id: `diary-${diary.diaryId}` };
            console.log('i: ', i);
            console.log('diary.createdAt', diary.createdAt);
            console.log('DiaryDate: ', DiaryDate);
            console.log('diaryId: ', diaryId);
            dateColor = 'bg-yellow';
            linkTo = '/diary/detail';
          }
        }
      }

      calendarTemp.push(
        <div style={{ textAlign: 'center' }}>
          {/* 감정 버튼 */}
          <Link to={linkTo}>
            <div
              onClick={() => mood(date)}
              className={`w-10 h-10 rounded-full ${dateColor} mx-auto flex items-center justify-center cursor-pointer`}></div>
          </Link>
          {/* 숫자(날짜) */}
          <div className="mt-[3px] mb-4 text-[12px]" {...diaryId}>
            {i}
          </div>
        </div>,
      );
    }

    setCalendar(calendarTemp);
  };

  // 캘린더 감정 아이콘
  const mood = day => {
    let dateString = moment(day).format('YYYY. M. D.'); // 날짜를 "2024. 2. 24." 형식의 문자열로 변환
    console.log('dateString: ', dateString);
    console.log('writtenDays', writtenDays);
  };

  return (
    <>
      <div>
        <div className="flex justify-center relative h-[60px] mt-2">
          <div className="absolute flex items-center">
            <button onClick={prevMonth} className="h-10  top-[6px]">
              <svg
                class="h-6 w-6 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                {' '}
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <span className=" ml-10 mr-10 text-gray-900 font-Heading3">
              {today.getFullYear()}년 {today.getMonth() + 1}월
            </span>

            <button onClick={nextMonth} className="h-10">
              <svg
                class="h-6 w-6 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                {' '}
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <button onClick={goToToday} className="h-10 ml-[350px]">
            오늘
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} className=" ml-3 mr-3">
          {calendar}
        </div>
      </div>

      <Todo />
    </>
  );
}
