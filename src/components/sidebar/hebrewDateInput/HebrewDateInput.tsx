import { useState } from "react"

const HebrewDateInput = () => {

    function MonSinceFirstMolad(nYearH: any) {
        var nMonSinceFirstMolad
    
        nYearH --
    
        nMonSinceFirstMolad = Math.floor(nYearH / 19) * 235

        nYearH = nYearH % 19

        nMonSinceFirstMolad += 12 * nYearH

        if (nYearH >= 17) {
          nMonSinceFirstMolad += 6
        } else if  (nYearH >= 14) {
          nMonSinceFirstMolad += 5
        } else if  (nYearH >= 11) {
          nMonSinceFirstMolad += 4
        } else if  (nYearH >= 8) {
          nMonSinceFirstMolad += 3
        } else if  (nYearH >= 6) {
          nMonSinceFirstMolad += 2
        } else if  (nYearH >= 3) {
          nMonSinceFirstMolad += 1
        }
        return nMonSinceFirstMolad
      }
    
      function IsLeapYear(nYearH : any) {
         var nYearInCycle
    
        nYearInCycle = nYearH % 19
        return ( nYearInCycle ==  3 ||
                 nYearInCycle ==  6 ||
                 nYearInCycle ==  8 ||
                 nYearInCycle == 11 ||
                 nYearInCycle == 14 ||
                 nYearInCycle == 17 ||
                 nYearInCycle == 0)
      }
    
      function Tishrei1(nYearH: any) : any {
        var nMonthsSinceFirstMolad
        var nChalakim
        var nHours
        var nDays
        var nDayOfWeek
        var dTishrei1

        nMonthsSinceFirstMolad = MonSinceFirstMolad(nYearH)
        nChalakim = 793 * nMonthsSinceFirstMolad
        nChalakim += 204

        nHours = Math.floor(nChalakim / 1080)
        nChalakim = nChalakim % 1080
    
        nHours += nMonthsSinceFirstMolad * 12
        nHours += 5
    
        nDays = Math.floor(nHours / 24)
        nHours = nHours % 24
    
        nDays += 29 * nMonthsSinceFirstMolad
        nDays += 2
    
        nDayOfWeek = nDays % 7
    
        if (!IsLeapYear(nYearH) &&
            nDayOfWeek == 3 &&
            (nHours * 1080) + nChalakim >= (9 * 1080) + 204) {
          nDayOfWeek = 5
          nDays += 2
        }
        else if ( IsLeapYear(nYearH - 1) &&
                  nDayOfWeek == 2 &&
                  (nHours * 1080) + nChalakim >= (15 * 1080) + 589 ) {
          nDayOfWeek = 3
          nDays += 1
        }
        else {
         
          if (nHours >= 18) {
            nDayOfWeek += 1
            nDayOfWeek = nDayOfWeek % 7
            nDays += 1
          }
          
          if (nDayOfWeek == 1 ||
              nDayOfWeek == 4 ||
              nDayOfWeek == 6) {
            nDayOfWeek += 1
            nDayOfWeek = nDayOfWeek % 7
            nDays += 1
          }
        }
    
        nDays -= 2067025
        dTishrei1 = new Date(1900, 0, 1) 
        dTishrei1.setDate(dTishrei1.getDate() + nDays)
    
        return dTishrei1
       }
    
      function LengthOfYear(nYearH: any) {
        var diff: any;
    
        let dThisTishrei1: any = Tishrei1(nYearH)
        let dNextTishrei1: any = Tishrei1(nYearH + 1)
        diff = (dNextTishrei1 - dThisTishrei1) / ( 1000 * 60 * 60 * 24)
        return Math.round(diff)
      }
    
      function HebToGreg(nYearH: any, nMonthH: any, nDateH: any) {
        var nLengthOfYear
        var bLeap
        var dGreg
        var nMonth
        var nMonthLen : any;
        var bHaser
        var bShalem
    
        bLeap = IsLeapYear(nYearH)
        nLengthOfYear = LengthOfYear(nYearH)
    
    
        bHaser = (nLengthOfYear == 353 || nLengthOfYear == 383)
        bShalem = (nLengthOfYear == 355 || nLengthOfYear == 385)

        dGreg = Tishrei1(nYearH)
    
        for (nMonth = 1; nMonth <= nMonthH - 1; nMonth ++) {
          if (nMonth == 1 ||
              nMonth == 5 ||
              nMonth == 8 ||
              nMonth == 10 ||
              nMonth == 12 ) {
            nMonthLen = 30
          } else if (nMonth == 4 ||
                     nMonth == 7 ||
                     nMonth == 9 ||
                     nMonth == 11 ||
                     nMonth == 13 ) {
              nMonthLen = 29
          } else if (nMonth == 6) {
              nMonthLen = (bLeap ? 30 : 0)
          } else if (nMonth == 2) {
              nMonthLen = (bShalem ? 30 : 29)
          } else if (nMonth == 3) {
              nMonthLen = (bHaser ? 29 : 30 )
          }
          dGreg.setDate(dGreg.getDate() + nMonthLen)
        }
        dGreg.setDate(dGreg.getDate() + nDateH - 1)
        return dGreg
      }

      function GregToHeb(dGreg: any) {
        var nYearH: any
        var nMonthH: any;
        var nDateH: any
        var nOneMolad: any
        var nAvrgYear: any
        var nDays: any
        var dTishrei1: any
        var nLengthOfYear: any
        var bLeap: any
        var bHaser: any
        var bShalem: any
        var nMonthLen: any
        var bWhile: any
        var d1900: any = new Date(1900, 0, 1)
    
        nOneMolad = 29 + (12 / 24) + (793 / (1080 * 24))
       
        nAvrgYear = nOneMolad * (235 / 19)
       
        nDays = Math.round((dGreg - d1900) / (24 * 60 * 60 * 1000))
        nDays += 2067025 
        nYearH = Math.floor(nDays / nAvrgYear) + 1
       
        dTishrei1 = Tishrei1(nYearH)
    
        if (SameDate(dTishrei1, dGreg)) {
          
          nMonthH = 1
          nDateH = 1
        }
        else  {
          
          if (dTishrei1 < dGreg) {
           
            while (Tishrei1(nYearH + 1) <= dGreg) {
              nYearH += 1
            }
          }
          else {
            
            nYearH -= 1
            while (Tishrei1(nYearH) > dGreg) {
              nYearH -= 1
            }
          }
    
          
          nDays = (dGreg - Tishrei1(nYearH)) / (24 * 60 * 60 * 1000)
          nDays = Math.round(nDays)

          nLengthOfYear = LengthOfYear(nYearH)
          bHaser = nLengthOfYear == 353 || nLengthOfYear == 383
          bShalem = nLengthOfYear == 355 || nLengthOfYear == 385
          bLeap = IsLeapYear(nYearH)
    
          // Add nDays to Tishrei 1.
          nMonthH = 1
          do {
    
            switch (nMonthH) {
              case 1:
              case 5:
              case 6:
              case 8:
              case 10:
              case 12:
                nMonthLen = 30
                break
              case 4:
              case 7:
              case 9:
              case 11:
              case 13:
                nMonthLen = 29
                break
              case 6: // Adar A (6) will be skipped on non-leap years
                nMonthLen = 30
                break
              case 2: // Cheshvan, see note above
                nMonthLen = (bShalem ? 30 : 29)
                break
              case 3: // Kislev, see note above
                nMonthLen = (bHaser ? 29: 30)
                break
            }
    
            if (nDays >= nMonthLen) {
              bWhile = true
              if (bLeap || nMonthH != 5) {
                nMonthH ++
              }
              else {
                // We can skip Adar A (6) if its not a leap year
                nMonthH += 2
              }
              nDays -= nMonthLen
            }
            else {
              bWhile = false
            }
          } while (bWhile)
          //Add the remaining days to Date
          nDateH = nDays + 1
        }
        return nMonthH + "/" + nDateH + "/" + nYearH
      }
    
      function SameDate(d1: any, d2: any) {
        return (d1.getFullYear() == d2.getFullYear() && 
                d1.getMonth() == d2.getMonth() && 
                d1.getDate() == d2.getDate())
                 
      }
    
      function FormatDateH(cDate: any) : any {
        var aDate = new Array()
        var cFormatDate
    
        aDate = cDate.split("/")
        switch (Number(aDate[0])) {
          case 1:
            cFormatDate = "Tishrei"
            break
          case 2:
            cFormatDate = "Cheshvan"
            break
          case 3:
            cFormatDate = "Kislev"
            break
          case 4:
            cFormatDate = "Teves"
            break
          case 5:
            cFormatDate = "Shevat"
            break
          case 6:
            cFormatDate = "Adar A"
            break
          case 7:
            cFormatDate = (IsLeapYear(Number(aDate[2])) ? "Adar B" : "Adar")
            break
          case 8:
            cFormatDate = "Nisan"
            break
          case 9:
            cFormatDate = "Iyar"
            break
          case 10:
            cFormatDate = "Sivan"
            break
          case 11:
            cFormatDate = "Tamuz"
            break
          case 12:
            cFormatDate = "Av"
            break
          case 13:
            cFormatDate = "Elul"
            break
        }
        cFormatDate += " " + aDate[1] + ", " + aDate[2]
        return cFormatDate
      }
    
      function FormatDate(dDate: any) : any {
        var sDate
        switch (dDate.getDay()) {
          case 0:
            sDate = "Sun "
            break
          case 1:
            sDate = "Mon "
            break
          case 2:
            sDate = "Tue "
            break
          case 3:
            sDate = "Wed "
            break
          case 4:
            sDate = "Thu "
            break
          case 5:
            sDate = "Fri "
            break
          case 6:
            sDate = "Sat "
            break
        }
        sDate += (dDate.getMonth() + 1) + "/"
        sDate += dDate.getDate() + "/"
        sDate += dDate.getFullYear()
        return sDate
      }
    
      function H2G() {
        let nYearH  = Number(yearHebrew)
        let nMonthH = Number(monthHebrew)
        let nDateH  = Number(dayHebrew)
        console.log( (FormatDateH(nMonthH + "/" + nDateH + "/" + nYearH) + " -> ") );
        console.log( (FormatDate(HebToGreg(nYearH, nMonthH, nDateH))) );
      }
    
      function G2H(nYearG: any, nMonthG: any, nDateG: any) {
        var nYearH
        var nMonthH
        var nDateH
        var dGreg
    
        nYearG  = Number(nYearG)
        nMonthG = Number(nMonthG)
        nDateG  = Number(nDateG)
        dGreg   = new Date(nYearG, nMonthG - 1, nDateG)
    
        document.write(FormatDate(dGreg) + " -> ")
        document.write(FormatDateH(GregToHeb(dGreg)))
        document.write("<p>")
    }

    const [yearHebrew, setYearHebrew] = useState(1990);
    const [monthHebrew, setMonthHebrew] = useState("Tishrei");
    const [dayHebrew, setDayHebrew] = useState(1);

    return (
        <div>
            <form >
                Month 
                <select name="MonthH" onChange={(e: any) => setMonthHebrew(e.target.value)} value={monthHebrew} >
                    <option value="1" />Tishrei
                    <option value="2" />Cheshvan
                    <option value="3" />Kislev
                    <option value="4" />Teves
                    <option value="5" />Shevat
                    <option value="6" />Adar A
                    <option value="7" />Adar (B)
                    <option value="8" />Nisan
                    <option value="9" />Iyar
                    <option value="10" />Sivan
                    <option value="11" />Tamuz
                    <option value="12" />Av
                    <option value="13" />Elul
                </select>
                Date 
                <select name="DateH"  onChange={(e: any) => setDayHebrew(e.target.value)} value={dayHebrew} >
                    <option value="1" />1
                    <option value="2" />2
                    <option value="3" />3
                    <option value="4" />4
                    <option value="5" />5
                    <option value="6" />6
                    <option value="7" />7
                    <option value="8" />8
                    <option value="9" />9
                    <option value="10" />10
                    <option value="11" />11
                    <option value="12" />12
                    <option value="13" />13
                    <option value="14" />14
                    <option value="15" />15
                    <option value="16" />16
                    <option value="17" />17
                    <option value="18" />18
                    <option value="19" />19
                    <option value="20" />20
                    <option value="21" />21
                    <option value="22" />22
                    <option value="23" />23
                    <option value="24" />24
                    <option value="25" />25
                    <option value="26" />26
                    <option value="27" />27
                    <option value="28" />28
                    <option value="29" />29
                    <option value="30" />30
                </select>
                Year 
                <input type="text" name="YearH" value={yearHebrew} onChange={(e: any) => setYearHebrew(e.target.value)} />
                
                <input 
                    type="button"
                    value="Convert Date"
                    onClick={() => H2G()}
                />
                
                Civl Month 
                <select name="MonthG">
                    <option value="1" />January
                    <option value="2" />Febuary
                    <option value="3" />March
                    <option value="4" />April
                    <option value="5" />May
                    <option value="6" />June
                    <option value="7" />July
                    <option value="8" />August
                    <option value="9" />September
                    <option value="10" />October
                    <option value="11" />November
                    <option value="12" />December
                </select>
                Date 
                <select name="DateG">
                    <option value="1" />1
                    <option value="2" />2
                    <option value="3" />3
                    <option value="4" />4
                    <option value="5" />5
                    <option value="6" />6
                    <option value="7" />7
                    <option value="8" />8
                    <option value="9" />9
                    <option value="10" />10
                    <option value="11" />11
                    <option value="12" />12
                    <option value="13" />13
                    <option value="14" />14
                    <option value="15" />15
                    <option value="16" />16
                    <option value="17" />17
                    <option value="18" />18
                    <option value="19" />19
                    <option value="20" />20
                    <option value="21" />21
                    <option value="22" />22
                    <option value="23" />23
                    <option value="24" />24
                    <option value="25" />25
                    <option value="26" />26
                    <option value="27" />27
                    <option value="28" />28
                    <option value="29" />29
                    <option value="30" />30
                    <option value="31" />31
                </select>
                Year 
                <input type="text" name="YearG" value="2005" />
                <input 
                    type="button"
                    value="Convert Date"
                    // onClick={() => G2H(YearG.value, MonthG.value, DateG.value)}
                />
            </form>
        </div>
    )
}

export default HebrewDateInput;