import React, {useLayoutEffect, useState} from 'react';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Label} from 'recharts';

import server from "../api";
import Table from "./table";

function App() {

    const [data, setData] = useState([]);
    const [ranges, setRanges] = useState({});
    const [rangedData, setRangedData] = useState([]);
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState(``);


    useLayoutEffect(() => {
        server.get(``)
            .then(response => {
                setData(response.data);
            });
    }, []);

    useLayoutEffect(() => {
        const ranges = {
            quarter: [[0]],
            month: [[0]],
            week: [[0]],
            day: [[0]],
        };

        Date.prototype.getQuarter = function () {
            return Math.floor(this.getMonth() / 3);
        };

        Date.prototype.getWeek = function () {
            const firstDay = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((new Date(this.getFullYear(), this.getMonth(), this.getDate()) - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
        };

        if (data[0]) {
            data.slice(1).reduce((prevArrayIndex, current, index) => {
                const prevDate = new Date(Date.parse(data[ranges.quarter[prevArrayIndex][0]].timestamp));
                const date = new Date(Date.parse(current.timestamp));
                if (date.getQuarter() === prevDate.getQuarter()) {
                    ranges.quarter[prevArrayIndex].push(index + 1);
                    return prevArrayIndex;
                } else {
                    ranges.quarter.push([index + 1]);
                    return prevArrayIndex + 1;
                }
            }, 0);
            data.slice(1).reduce((prevArrayIndex, current, index) => {
                const prevDate = new Date(Date.parse(data[ranges.month[prevArrayIndex][0]].timestamp));
                const date = new Date(Date.parse(current.timestamp));
                if (date.getMonth() === prevDate.getMonth()) {
                    ranges.month[prevArrayIndex].push(index + 1);
                    return prevArrayIndex;
                } else {
                    ranges.month.push([index + 1]);
                    return prevArrayIndex + 1;
                }
            }, 0);
            data.slice(1).reduce((prevArrayIndex, current, index) => {
                const prevDate = new Date(Date.parse(data[ranges.week[prevArrayIndex][0]].timestamp));
                const date = new Date(Date.parse(current.timestamp));
                if (date.getWeek() === prevDate.getWeek()) {
                    ranges.week[prevArrayIndex].push(index + 1);
                    return prevArrayIndex;
                } else {
                    ranges.week.push([index + 1]);
                    return prevArrayIndex + 1;
                }
            }, 0);
            data.slice(1).reduce((prevArrayIndex, current, index) => {
                const prevDate = new Date(Date.parse(data[ranges.day[prevArrayIndex][0]].timestamp));
                const date = new Date(Date.parse(current.timestamp));
                if (date.getDay() === prevDate.getDay()) {
                    ranges.day[prevArrayIndex].push(index + 1);
                    return prevArrayIndex;
                } else {
                    ranges.day.push([index + 1]);
                    return prevArrayIndex + 1;
                }
            }, 0);
            setRanges(ranges);
            const tmpNewDate = [];
            ranges.quarter[ranges.quarter.length - 1].forEach(item => {
                const tmp = Object.assign({}, data[item]);
                tmp.timestamp = getDateString(tmp);
                tmpNewDate.push(tmp);
            });
            setRangedData(tmpNewDate);
            setPage(ranges.quarter.length);
            setCategory(`quarter`);
        }
    }, [data]);

    const getDateString = (tmp) => {
        let month = tmp.timestamp.slice(5, 7);
        const getMonthString = (month) => {
            switch (parseInt(month)) {
                case 1:
                    return `Jan`;
                case 2:
                    return `Feb`;
                case 3:
                    return `Mar`;
                case 4:
                    return `Apr`;
                case 5:
                    return `May`;
                case 6:
                    return `June`;
                case 7:
                    return `Jul`;
                case 8:
                    return `Aug`;
                case 9:
                    return `Sep`;
                case 10:
                    return `Oct`;
                case 11:
                    return `Nov`;
                case 12:
                    return `Dec`;

            }
        };
        month = getMonthString(month);
        return `${month} ${tmp.timestamp.slice(8, 10)}`;
    };

    const rangeData = (evt) => {
        const range = ranges[evt.target.value][ranges[evt.target.value].length - 1];
        const tmpNewDate = [];
        range.forEach((item) => {
            const tmp = Object.assign({}, data[item]);
            tmp.timestamp = getDateString(tmp);
            tmpNewDate.push(tmp);
        });
        setPage(ranges[evt.target.value].length);
        setRangedData(tmpNewDate);
        setCategory(evt.target.value);
    };

    const prevPage = (evt) => {
        evt.preventDefault();
        const range = ranges[category][Math.max(0, page - 2)];
        const tmpNewDate = [];
        range.forEach((item) => {
            const tmp = Object.assign({}, data[item]);
            tmp.timestamp = getDateString(tmp);
            tmpNewDate.push(tmp);
        });
        setPage(Math.max(1, page - 1));
        setRangedData(tmpNewDate);
    };

    const nextPage = (evt) => {
        evt.preventDefault();
        const range = ranges[category][Math.min(ranges[category].length - 1, page)];
        const tmpNewDate = [];
        range.forEach((item) => {
            const tmp = Object.assign({}, data[item]);
            tmp.timestamp = getDateString(tmp);
            tmpNewDate.push(tmp);
        });
        setPage(Math.min(ranges[category].length - 1, page + 1));
        setRangedData(tmpNewDate);
    };

    return <>
        <h1>Stats</h1>
        <p
            className="date-range"
        >
            {rangedData[0] ? `From ${rangedData[0].timestamp} through ${rangedData[rangedData.length - 1].timestamp}` : `Waiting...`}
        </p>
        <div className="range-switch">
            <button onClick={prevPage}>Prev</button>
            <select onChange={rangeData}>
                <option value="quarter">quarter</option>
                <option value="month">month</option>
                <option value="week">week</option>
                <option value="day">day</option>
            </select>
            <button onClick={nextPage}>Next</button>
        </div>
        <div className="table-container">
            <Table
                data={rangedData ? rangedData : []}
            />
        </div>

        <div className="graphs-overflow">
            <div className="graph">
                <BarChart width={1000} height={200} data={rangedData ? rangedData : []}>
                    <XAxis dataKey="timestamp" stroke="#8884d8"/>
                    <Tooltip wrapperStyle={{width: `auto`, backgroundColor: '#ccc'}}/>
                    <Legend width={100} wrapperStyle={{
                        top: 40,
                        right: 20,
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d5d5d5',
                        borderRadius: 3,
                        lineHeight: '40px',
                        padding: '10px',
                        width: 'auto'
                    }}/>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                    <Bar dataKey="webstorm" fill="#6600CC" barSize={30}/>
                </BarChart>
            </div>
            <div className="graph">
                <BarChart width={1000} height={200} data={rangedData ? rangedData : []}>
                    <XAxis dataKey="name" stroke="#8884d8"/>
                    <Tooltip wrapperStyle={{width: `auto`, backgroundColor: '#ccc'}}/>
                    <Legend width={100} wrapperStyle={{
                        top: 40,
                        right: 20,
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d5d5d5',
                        borderRadius: 3,
                        lineHeight: '40px',
                        padding: '10px',
                        width: 'auto'
                    }}/>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                    <Bar dataKey="idea" fill="#0033CC" barSize={30}/>
                </BarChart>
            </div>
            <div className="graph">
                <BarChart width={1000} height={200} data={rangedData ? rangedData : []}>
                    <XAxis dataKey="name" stroke="#8884d8"/>
                    <Tooltip wrapperStyle={{width: `auto`, backgroundColor: '#ccc'}}/>
                    <Legend width={100} wrapperStyle={{
                        top: 40,
                        right: 20,
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d5d5d5',
                        borderRadius: 3,
                        lineHeight: '40px',
                        padding: '10px',
                        width: 'auto'
                    }}/>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                    <Bar dataKey="goland" fill="#009999" barSize={30}/>
                </BarChart>
            </div>
        </div>
    </>
}

export default App;