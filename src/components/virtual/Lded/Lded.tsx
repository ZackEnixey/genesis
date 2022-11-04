import lded from "./lded.json";
import { RequiredOnPage } from "./RequiredOnPage";
import { SearchElementType } from "./SearchElementType";

const Lded = () => {
    let documentDef: any = lded;
    const searchEl = documentDef?.extractionAlgorithmDefinitions[0]?.documentExtractionDef?.searchElementDefinitions;
    
    const countSearchElements = (
        searchEl: any, 
        initialCounterValues: any
        ) => {

        let {
            numberOfAllSearchEl, 
            regexElements, 
            usedOntologies, 
            repeatableGroups, 
            relationElements, 
            relations,
            classRelatedSearchEl,
            elementsWithNoRelations,
            heavySearchEl,
            imageMiningSearchEl,
            identCounter,
            maxIdent
        } = initialCounterValues;

        identCounter++;

        if(identCounter>maxIdent) 
            maxIdent = identCounter;

        for (let element of searchEl) {
            if (element?.searchElementType ===SearchElementType.REG_EX_TEXT_SEARCH_ELEMENT){
                regexElements++;
            }

            if (element?.searchElementType === SearchElementType.TERM_TEXT_SEARCH_ELEMENT && element?.termTextSearchElementInputParams?.useOntology){
                usedOntologies++;
            }

            if (element?.searchElementType === SearchElementType.REPEATABLE_GROUP_SEARCH_ELEMENT){
                repeatableGroups++;
            }

            numberOfAllSearchEl++;
            if(element?.relations?.length){
                relationElements++;
                relations += element?.relations?.length;
            }

            if(element?.requiredOnPage === RequiredOnPage.ON_FIRST_PAGE || element?.requiredOnPage === RequiredOnPage.ON_LAST_PAGE ||element?.requiredOnPage === RequiredOnPage.ANYWHERE_IN_DOCUMENT ||element?.requiredOnPage === RequiredOnPage.PROHIBITED ||element?.requiredOnPage === RequiredOnPage.IN_RANGE_OF_PAGES){
                classRelatedSearchEl++;
            }

            if(!element?.relations?.length) {
                elementsWithNoRelations++;
            }

            if( !element?.relations?.length && element?.regExTextSearchElementInputParams?.maxAllowedMultilines > 1 && element?.regExTextSearchElementInputParams?.skipLargeLineGaps) {
                heavySearchEl++;
            }

            if (
                element?.searchElementType === SearchElementType.SIGNATURE_SEARCH_ELEMENT ||
                element?.searchElementType === SearchElementType.BARCODE_SEARCH_ELEMENT ||
                element?.searchElementType === SearchElementType.CHECK_BOX_GROUP_SEARCH_ELEMENT
              ) {
                imageMiningSearchEl++;
              }

            if (element?.searchElementDefinitions) {
                let currentCounterValues = {
                    numberOfAllSearchEl: 0,
                    regexElements: 0,
                    usedOntologies: 0,
                    repeatableGroups: 0,
                    relationElements: 0,
                    relations: 0,
                    classRelatedSearchEl: 0,
                    elementsWithNoRelations: 0,
                    heavySearchEl: 0,
                    imageMiningSearchEl: 0,
                    identCounter: identCounter,
                    maxIdent: maxIdent
                }
                let child = countSearchElements(element?.searchElementDefinitions, currentCounterValues);
                numberOfAllSearchEl += child?.numberOfAllSearchEl;
                regexElements += child?.regexElements;
                usedOntologies += child?.usedOntologies;
                repeatableGroups += child?.repeatableGroups;
                classRelatedSearchEl += child?.classRelatedSearchEl;
                relationElements += child?.relationElements;
                relations += child?.relations;
                elementsWithNoRelations += child?.elementsWithNoRelations;
                heavySearchEl += child?.heavySearchEl;
                console.log(imageMiningSearchEl);
                imageMiningSearchEl += child?.imageMiningSearchEl;
                maxIdent = child?.maxIdent;
            }
        }
        return {
            numberOfAllSearchEl, 
            regexElements, 
            usedOntologies, 
            repeatableGroups, 
            relationElements, 
            relations,
            classRelatedSearchEl,
            elementsWithNoRelations,
            heavySearchEl,
            imageMiningSearchEl,
            maxIdent
        };
    };

    const getAverageNumberOfRelations = (
        relations: number,
        relationElements: number
      ) => {
        if (isNaN(relations) || relations === 0) return 0;
        if (!relationElements) return 0;
        const averageNumberOfRelations = relations / relationElements;
        return Number(averageNumberOfRelations.toFixed(2));
      };

    const calculateMaintainabilityIndex = (filteredResult: any) => {
        console.log(filteredResult);
        let rootElements: number = searchEl.length;
        let usedOntologies: number = filteredResult.usedOntologies;
        let relationsPerSearchAverage: number = getAverageNumberOfRelations(filteredResult.relations, filteredResult.relationElements);
        let maxDepth: number = filteredResult.maxIdent;
        let totalNumOfHeavySearchEl: number = filteredResult.heavySearchEl;

        let maintainabilityIndex: number = 10 - getMathMin(rootElements,2,600,2) - getMathMin(usedOntologies,1,20,1) - getMathMin(relationsPerSearchAverage,2,50,2) - getMathMin(maxDepth,2,7,2) - getMathMin(totalNumOfHeavySearchEl,2,4,2);

        return Number(maintainabilityIndex.toFixed(2));
    }

    const getMathMin = (base: number, numerator: number, denominator: number, limit: number): number => {
        if(isNaN(base) || typeof base !== "number") return 0;
        let currentSpan: number = base*numerator/denominator;
        let result: number = Math.min(currentSpan, limit);
        return Number(result.toFixed(2));
    }

    const renderSummary = () => {
        if (!searchEl) 
            return <div> no data </div>;

        let initialCounterValues: any = {
            numberOfAllSearchEl: 0, 
            regexElements: 0, 
            usedOntologies: 0, 
            repeatableGroups: 0, 
            relationElements: 0, 
            relations: 0,
            classRelatedSearchEl: 0,
            elementsWithNoRelations: 0,
            heavySearchEl: 0,
            imageMiningSearchEl: 0,
            identCounter: 0,
            maxIdent: 0
        }
        let filteredResult = countSearchElements(searchEl, initialCounterValues);
        let numberOfRelationsAverage: number = getAverageNumberOfRelations(filteredResult.relations, filteredResult.relationElements);
        return (
            <div>
                <div>
                    <div> Total number of root search element definitions: {searchEl.length}</div>
                    <div> Total number of all search element definitions: {filteredResult.numberOfAllSearchEl}</div>
                    <div> Total number of used ontologies: {filteredResult.usedOntologies}</div>
                    <div> Total number of repeatable groups: {filteredResult.repeatableGroups}</div>
                    <div> Average amount of relations per search element definition: {numberOfRelationsAverage}</div>
                    <div> Max depth of inner search elements: {filteredResult.maxIdent} </div>
                    <div> Total number of classification related search elements: {filteredResult.classRelatedSearchEl}</div>
                    <div> Total number of search elements without relations: {filteredResult.elementsWithNoRelations}</div>
                    <div> Total number of heavy search elements (without relations, skip large line gaps ON or multiline ON):{filteredResult.heavySearchEl}</div>
                    <div> Total number of image mining search elements: {filteredResult.imageMiningSearchEl}</div>
                    <div> Total number of regex search element definitions: {filteredResult.regexElements}</div>
                </div>
                <div style={{width: 100, height: 100, color: "gray", background: "lightblue", fontSize: "25px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    {calculateMaintainabilityIndex(filteredResult)}
                </div>
            </div>
         
        );
      };

    return (
        <div>
            {renderSummary()}
        </div>
    )
}

export default Lded;