import React, {useLayoutEffect, useState} from 'react';

function Table(props) {

    const {data} = props;

    const [tableData, setTableData] = useState([]);

    const convertToInt = (key, element, array) => {
        if (element[key] !== `` && element[key] !== `null`)
            array.push(parseInt(element[key]))
    };

    const min = array => array ? Math.min(...array) : `undefined`;
    const max = array => array ? Math.max(...array) : `undefined`;
    const average = (array) =>
        array && array.length
            ? Math.round(array.reduce((previous, current) => current + previous, 0) / array.length)
            : `undefined`;

    useLayoutEffect(() => {
        const webstorm = [], idea = [], goland = [];
        data.forEach((element) => {
            convertToInt(`webstorm`, element, webstorm);
            convertToInt(`idea`, element, idea);
            convertToInt(`goland`, element, goland);
        });
        setTableData([idea, webstorm, goland]);
    }, [data]);

    return <div className="table">
        <p>Product</p>
        <p>Min Usage</p>
        <p>Max Usage</p>
        <p>Average Usage</p>

        <p>IDEA</p>
        <p>{min(tableData[0])}</p>
        <p>{max(tableData[0])}</p>
        <p>{average(tableData[0])}</p>

        <p>WebStorm</p>
        <p>{min(tableData[1])}</p>
        <p>{max(tableData[1])}</p>
        <p>{average(tableData[1])}</p>

        <p>Goland</p>
        <p>{min(tableData[2])}</p>
        <p>{max(tableData[2])}</p>
        <p>{average(tableData[2])}</p>
    </div>
}

export default Table;