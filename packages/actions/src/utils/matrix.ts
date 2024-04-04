

/**
 * @input {node:[1,2,3,4],version:[5,6],c:[7,8,9]}
 * @output 这个matrix 的组合参数，如 [1,5,7],[1,6,7]....
 * **/
export function generateMatrixTasks(obj: Record<string, any[]>,groupByField?:string) {
    return generateMatrixCombinations(obj,groupByField)
}

interface MatrixObject {
    [key: string]: any
}

function generateMatrixCombinations(
    input: Record<string, number[]>,
    groupByField?: string
): MatrixObject[][] {
    const keys: string[] = Object.keys(input);
    if(keys.length===0){
        return []
    }
    const combinations: MatrixObject[][] = [];

    function generateCombinations(index: number, currentCombination: MatrixObject[]): void {
        if (index === keys.length) {
            combinations.push([...currentCombination]);
            return;
        }

        const currentKey: string = keys[index];
        const values: number[] = input[currentKey];

        for (const value of values) {
            currentCombination.push({
                ...currentCombination[currentCombination.length - 1],
                [currentKey]: value,
            });
            generateCombinations(index + 1, currentCombination);
            currentCombination.pop();
        }
    }

    generateCombinations(0, []);

    // Determine the default groupByField as the one with the fewest elements
    if (!groupByField) {
        groupByField = keys.reduce((minKey, currentKey) => {
            return input[currentKey].length < input[minKey].length ? currentKey : minKey;
        });
    }

    // Group combinations by the specified or default field
    const groupedCombinations: Record<number, MatrixObject[]> = combinations.reduce(
        (grouped: Record<string, any>, combination) => {
            const fieldValue: number = combination[combination.length - 1][groupByField!];
            if (!grouped[fieldValue]) {
                grouped[fieldValue] = [];
            }
            grouped[fieldValue].push(combination[combination.length - 1]);
            return grouped;
        },
        {}
    );

    return Object.values(groupedCombinations);
}



