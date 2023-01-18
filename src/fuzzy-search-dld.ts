// function to print pretty matrix
export function printMatrix(source:string, target:string, matrix: number[][]) {
    source = "##" + source;
    target = "###" + target;

    console.log(target.split("").join("\t"));

    for (let i = 0; i < matrix.length; i++) {
        console.log(source[i]+"\t"+matrix[i].join('\t'));
    }
}

export function damerauLevenshteinDistance(source: string, target: string) {
    if (!source || source.length === 0) {
        // If both strings are empty, the distance is 0
        if (!target || target.length === 0) {
            return 0;
        } else {
            // If only the source is empty, the distance is the length of the target
            return target.length;
        }
    }
    else if (!target) {
        // If only the target is empty, the distance is the length of the source
        return source.length;
    }
    
    // Remember that the string is 0 indexed
    const sourceLength = source.length;
    const targetLength = target.length;

    // distance matrix is 1 indexed
    const distanceMatrix:number[][] = []

    // Set infinity to the sum of the lengths of the strings
    const INF = sourceLength + targetLength;


    distanceMatrix[0] = [INF]; // (0) is an array contains a infinity

    // Set the 0 row and column to infinity
    // And the 1 row and column to the distance by merely adding or removing a character
    for (let i = 0; i <= sourceLength; i++) {
        distanceMatrix[i + 1] = [];
        distanceMatrix[i + 1][1] = i;
        distanceMatrix[i + 1][0] = INF;
    }

    for (let j = 0; j <= targetLength; j++) {
        distanceMatrix[1][j + 1] = j;
        distanceMatrix[0][j + 1] = INF;
    }

    // Create a dictionary of last row positions
    // of each character in the source strings
    const lastMatchedRowOfTheCharacter:{[char: string]: number} = {};

    // Iterate through the source string aka the rows
    for (let row = 1; row <= sourceLength; row++) {

        // Set the current character in the source string
        const sourceChar = source[row - 1];

        // Set the  last matched character's column index in the current row to 0 (no match)
        let lastMatchedColumnIndex = 0;

        // Iterate through the target strings aka columns
        // and calculate the distance
        for (let col = 1; col <= targetLength; col++) {
            
            //Get the current character in the target strings
            const targetChar = target[col - 1];

            // Try get the last matched row of the current character in the target string from the dictionary
            // If it doesn't exist, set the dictionary value to 0 and get it
            if (lastMatchedRowOfTheCharacter[targetChar] === undefined) {
                lastMatchedRowOfTheCharacter[targetChar] = 0;
            }

            const lastMatchedRow = lastMatchedRowOfTheCharacter[targetChar];

            
            // Calculate the cost of the substitution
            // If the characters are the same, the cost is 0
            const cost = sourceChar === targetChar ? 0 : 1;

            // Calculate the distance for the other cases (removal, insertion, substitution)
            // Remember that the distance matrix is 1 indexed so i-1 is i and j is j+1
            const distaneAdding = distanceMatrix[row][col + 1] + 1;
            const distanceRemoving = distanceMatrix[row + 1][col] + 1;
            const distanceSubstitution = distanceMatrix[row][col] + cost;

            // Calculate the distance for transposition
            const distanceTransposition = distanceMatrix[lastMatchedRow][lastMatchedColumnIndex] +
                (row - lastMatchedRow - 1) + 1 + 
                (col - lastMatchedColumnIndex - 1);

            // Set the distance to the minimum of the other cases
            distanceMatrix[row + 1][col + 1] = Math.min(distaneAdding, distanceRemoving, distanceSubstitution, distanceTransposition);
            
            //If the characters are the same, update the last matched column indexed
            //This is used for distanceTransposition
            if (cost === 0) {
                lastMatchedColumnIndex = col;
            }
        }
        // Update the last matched row of the current character in the source strings
        lastMatchedRowOfTheCharacter[sourceChar] = row;
    }
    // printMatrix(source, target, distanceMatrix);
    return distanceMatrix[sourceLength + 1][targetLength + 1];
}

export function dld(source: string, target: string) {
    const distance = damerauLevenshteinDistance(source, target);
    // let ratio = 1 - (distance / Math.max(source.length, target.length));
    const ratio = 1 - (distance / (source.length + target.length));
    return ratio;

}
