import axios from "axios";
import { useContext, useState } from "react";
import { BoardContext } from "../../../context";

const HebrewDateInput2 = () => {
    const { selectedDateFromDatePicker, setSelectedDateFromDatePicker } = useContext(BoardContext); 
    
    const [dayNumber, setDayNumber] = useState<number>(1);
    const [monthName, setMonthName] = useState('Tishrei');
    const [yearNumber, setYearNumber] = useState<number>(5782);
    const convertDate = () => {
        const hebrewToGregorianUrlLink: string = "https://www.hebcal.com/converter?cfg=json&hy="+yearNumber+"&hm="+monthName+"&hd="+dayNumber+"&h2g=1&strict=1";

        console.log(hebrewToGregorianUrlLink);

        axios.get(hebrewToGregorianUrlLink).then((response: any) => {
            let data = response.data;
            console.log(data);
            let gregorianDate = new Date(data.gy + " " + data.gm + " " + data.gd);
            console.log(gregorianDate);
            setSelectedDateFromDatePicker(gregorianDate);
          });

    }

    const enterDayNumber = () => {
        return (
            <div style={{display: "flex", justifyContent: "right"}}>
                <div> day: </div>
                <input 
                    type="number" 
                    min="1"
                    max="31"
                    value={dayNumber}
                    onChange={(event: any) => setDayNumber(event.target.value)}
                />
            </div>
        )
    }

    const enterMonthWord = () => {
        return (
            <div style={{display: "flex", justifyContent: "right"}}>
                <div> month: </div>
                <select value={monthName} onChange={(event: any) => setMonthName(event.target.value)}>
                    <option value="Nisan">Nisan</option>
                    <option value="Iyyar">Iyyar</option>
                    <option value="Sivan">Sivan</option>
                    <option value="Tamuz">Tamuz</option>
                    <option value="Av">Av</option>
                    <option value="Elul">Elul</option>
                    <option value="Tishrei">Tishrei</option>
                    <option value="Cheshvan">Cheshvan</option>
                    <option value="Kislev">Kislev</option>
                    <option value="Tevet">Tevet</option>
                    <option value="Shvat">Shvat</option>
                    <option value="Adar">Adar</option>
                    <option value="Adar1">Adar1</option>
                    <option value="Adar2">Adar2</option>
                </select>
            </div>
        )
    }

    const enterYearNumber = () => {
        return (
            <div style={{display: "flex", justifyContent: "right"}}>
                <div> year: </div>
                <input 
                    type="number" 
                    min="1"
                    max="100000"
                    value={yearNumber}
                    onChange={(event: any) => setYearNumber(event.target.value)}
                />
            </div>
        )
    }

    return (
        <div className="hebrew_date_input_wrapper">
            <div> PICK HEBREW DATE: </div>
            {enterDayNumber()}
            {enterMonthWord()}
            {enterYearNumber()}
            <button onClick={convertDate}> convert </button>
        </div>
    )
}

export default HebrewDateInput2;