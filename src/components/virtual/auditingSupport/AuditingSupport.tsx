import auditingSupport from "./auditingSupport.json";

const AuditingSupport = () => {

    const classificationReporterItem = (item: string, i: number) => {
        let str = item;

        // #1 18:24:11  is there | in the first 8 characters is number on the left
        let time: string = "";
        let expectedIndexOfEndSeparator: number = 9;
        let dateEndSeparatorIndex = str.substring(0, expectedIndexOfEndSeparator).indexOf("|");
        if (typeof Number(str[dateEndSeparatorIndex-1]) === "number") {
            time = str.substring(0, dateEndSeparatorIndex);
            str = str.substring(dateEndSeparatorIndex+1);
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
            auditingTitle = str.substring(titleStartIndex, titleEndIndex+2);
            str = str.substring(titleEndIndex + 2);
        }

        // #4   if no '[' just take everything from title to the end
        let descriptionEndIndex: number = str.indexOf('[');
        let description = descriptionEndIndex !== -1 ? str.substring(0, descriptionEndIndex) : str;
        str = descriptionEndIndex !== -1 ? str.substring(descriptionEndIndex) : "";

        // #5 [...] array of arrays
        let arrays: string[] = [];
        let numberOfElements: number = str.replace(/[^[]/g, "").length;
        for(let i = 0; i<numberOfElements; i++) {
            let openBracketIndex: number = str.indexOf("[");
            let closingBracketIndex: number = str.indexOf("]");
            arrays.push(str.substring(openBracketIndex, closingBracketIndex + 1));
            str = str.substring(closingBracketIndex + 1);
        }

        return (
            <div key={i} className="audit_item">
               {time && <span className='audit_time audit_item'> {time} </span>}
               {notificationType && <span>|<span className='audit_type audit_item'> {notificationType} </span>|</span>}
               {auditingTitle && <span className='audit_title audit_item'> {auditingTitle} </span>}
               {description && <span className='audit_description audit_item'> {description} </span>}
               {arrays.length > 0 &&  renderArrays(arrays) }
               {str.length > 0 && <span className='audit_rest audit_item'> {str} </span>}
            </div>
        )
    }

    const renderArrays = (arrays: string[]) => {
        return arrays.map( (item: string, i: number) => {
            if (arrays.length > 1 && i !== arrays.length - 1)
                return <span key={i}><span className='audit_arrays audit_item'> {item} </span>, </span>
            return <span className='audit_arrays audit_item' key={i}> {item} </span>
        })
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
