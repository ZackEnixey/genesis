import auditingSupport from "./auditingSupport.json";

const AuditingSupport = () => {

    const classificationReporterItem = (item: string, i: number) => {
        let str = item;
    
        // #1 18:24:11  is there | in the first 8 characters is number on the left
        let time: string = "";
        let expectedIndexOfEndSeparator: number = 9;
        let dateEndSeparatorIndex = str
          .substring(0, expectedIndexOfEndSeparator)
          .indexOf("|");
        if (typeof Number(str[dateEndSeparatorIndex - 1]) === "number") {
          time = str.substring(0, dateEndSeparatorIndex);
          str = str.substring(dateEndSeparatorIndex + 1);
        }
    
        // #2 |Info|     info part is between the first '|' and the next one
        let notificationType: string = "";
        let notificationTypeEndIndex: number = str.indexOf("|");
        if (notificationTypeEndIndex !== -1) {
          notificationType = str.substring(0, notificationTypeEndIndex);
          str = str.substring(notificationTypeEndIndex + 1);
        }
    
        // #3 [# DOC_CLASSIFIER #]     if [# is the next character, look for the '#]'
        let auditingTitle: string = "";
        let titleStartIndex: number = str.indexOf("[#");
        let titleEndIndex: number = str.indexOf("#]");
        if (titleStartIndex !== -1 && titleEndIndex !== -1) {
          auditingTitle = str.substring(titleStartIndex, titleEndIndex + 2);
          str = str.substring(titleEndIndex + 2);
        }
    
        // #4   if no '[' just take everything from title to the end
        let descriptionEndIndex: number = str.indexOf("[");
        let description = descriptionEndIndex !== -1 ? str.substring(0, descriptionEndIndex) : str;
        str = descriptionEndIndex !== -1 ? str.substring(descriptionEndIndex) : "";
    
        // #5 [...] array of arrays
        let arrays: string[] = [];
        let numberOfElements: number = str.replace(/[^[]/g, "").length;
        for (let i = 0; i < numberOfElements; i++) {
          let openBracketIndex: number = str.indexOf("[");
          let closingBracketIndex: number = str.indexOf("]");
          arrays.push(str.substring(openBracketIndex, closingBracketIndex + 1));
          str = str.substring(closingBracketIndex + 1);
        }
    
        return (
          <div key={i} className="audit_item">
            {time && <span className="audit_time audit_item"> {time} </span>}
            {notificationType && (<span>|<span className="audit_type audit_item"> {notificationType} </span>|</span>)}
            {auditingTitle && (<span className="audit_title audit_item"> {addStyleToAuditingTitle(auditingTitle)} </span>)}
            {description && (<span className="audit_description audit_item"> {addStyleToDescription(description)} </span>)}
            {arrays.length > 0 && renderArrays(arrays)}
            {str.length > 0 && (<span className="audit_rest audit_item"> {str} </span>)}
          </div>
        );
    };

    const addStyleToAuditingTitle = (auditingTitle: string) => {
        let openBrackets = "[##";
        let closedBrackets = "##]";
        if(auditingTitle.includes("DOC_CLASSIFIER")){
            openBrackets = "[#";
            closedBrackets = "#]";
            return <span> {openBrackets} <span style={{color: "blue", fontWeight: 700}}>{auditingTitle.substring(3,auditingTitle.length-3)}</span> {closedBrackets}</span>
        }
        return <span> {openBrackets} <span style={{color: "black", fontWeight: 700}}>{auditingTitle.substring(3,auditingTitle.length-3)}</span> {closedBrackets}</span>
    }

    const boldWords = ["Raw classification data keys",
        "Raw classification data values",
        "Verifying assembled document group",
        "Documents passing prohibited elements check",
        "Documents passing firstPage/LastPage elements check",
        "Documents passing requiredAnywhere elements check",
        "Documents passing total classification score check",
        "Fully assembled and classified documents are",
        "Mapping of classification hits to documents completed. Documents produced",
        "Classification and assembly completed",
        "execution time"];

    const addStyleToDescription = (description: string) => {
        for(let i=0; i<boldWords.length; i++){
            if(description.includes(boldWords[i])) {
                const firstPart = description.substring(0, description.indexOf(boldWords[i]));
                description = description.substring(boldWords[i].length + firstPart.length);
                return (
                    <span><span>{firstPart}</span><span style={{fontWeight: 700}}>{boldWords[i]}</span>{description}</span>
                )
            }
        }
        return description;
    }

    const renderArrays = (arrays: string[]) => {
      console.log("-mmm- : ", arrays, arrays.length);

        return arrays.map((item: string, i: number) => {
          if (arrays.length > 0)
            return (
              <span key={i}>
                <span className="audit_arrays audit_item"> {addStyleToArray(item)}</span>,{" "}
              </span>
            );
          return (
            <span className="audit_arrays audit_item" key={i}>{item}</span>
          );
        });
    };

    const addStyleToArray = (item: string) => {
        console.log("696969: ", item);
        let lastApostrophe: number = 0;
        let firstApostrophe: number = 0;

        let properties: string[] = [];
        let values: string[] = [];
       
        while(item.includes("'")) {
            firstApostrophe = item.indexOf("'");
            properties.push(item.substring(0,firstApostrophe));
            item = item.substring(firstApostrophe+1);
            lastApostrophe = item.indexOf("'");
            values.push("'"+item.substring(0,lastApostrophe+1));
            item = item.substring(lastApostrophe+1);
        }

        let response: any = properties.map( (pop: string, i: number) => {
            if(shouldBeGreen(values[i])) return <span key={i}><span>{pop}</span><span style={{color: "green", fontWeight: 600}}> '{values[i]}</span></span>
            if(shouldBeRed(values[i])) return <span key={i}><span>{pop}</span><span style={{color: "red", fontWeight: 600}}> '{values[i]}</span></span>
            if(pop.length < 2) return <span key={i}><span>{pop}</span><span> '{values[i]}</span></span>
            return <span key={i}><span>{pop}</span><span style={{color: "brown"}}> '{values[i]}</span></span>

        })
       
        return <span>{response}<span>{item}</span></span>
    }

    const shouldBeGreen = (item: string) => {
        return item.includes("RequiredAnywhere") || item.includes("RequiredOnFirstPage") || item.includes("RequiredOnLastPage");
    }

    const shouldBeRed = (item: string) => {
        return item.includes("None") || item.includes("Prohibited");
    }

    return (
        <div className="designer__document">
            <div className="designer__document-auditing-head"> Some title if needed </div>
            <div className="designer__document-auditing-body">
                <div> B O D Y </div>
                {auditingSupport.auditingSupport.map( (item: string, i: number) => classificationReporterItem(item, i))}
            </div>
        </div>
    )
}

export default AuditingSupport
