import { SwitchRows, MultiplyRow, AddRows } from "../utilities/CalcFunctions";
import { fraction, randomInt } from "mathjs";

export async function solMatrixRREF(
  dimension = "random", 
  solution = "random",
  resultCol = false
){
  const rawData = await fetch(`/data/challenge/matrix_rref.json`);
  const data = await rawData.json();
  const possibilities = data[0].dimension;

  // dimension
  if (![1, 2, 3].includes(dimension)) {
    dimension = Math.floor(Math.random() * 3) + 1;
  }
  // solution
  if (!["no","one","infinite"].includes(solution)){
    const rand = Math.floor(Math.random() * 3);
    solution = ["no", "one", "infinite"][rand];
  }
  // no solution only possibible with resultCol
  if (solution === "no" && !resultCol){
    const rand = Math.floor(Math.random() * 2);
    solution = ["infinite", "one"][rand];
  }

  // random matrix
  let matrix;
  if (solution === "one") {
    const list = possibilities[dimension].solution.one;
    matrix = list[Math.floor(Math.random() * list.length)];
  }
  else { // no or infinite
    const list= possibilities[dimension].solution.infinite;
    matrix = list[Math.floor(Math.random() * list.length)];
  }

  // add resultCol
  if (resultCol){
    matrix = matrix.map(row => [...row, Math.floor(Math.random() * 10)-5]);
  }
  else {
    return {matrix: matrix, solution: solution}
  }

  if (solution === "no" || solution === "infinite") {

    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];

      // check null row (ignore last column, resultCol)
      const rowWithoutResult = row.slice(0, -1);

      const isNullRow = rowWithoutResult.every(v => v === 0);

      if (isNullRow) {
        if (solution === "infinite") {
          // must be 0
          matrix[i][matrix[i].length - 1] = 0;
        } else if (solution === "no") {
          // must be != 0
          matrix[i][matrix[i].length - 1] = randomNonZero();

          const rand = Math.floor(Math.random() * 3);
          if (rand === 0) break;
        }
      }
    }
  }

  return {matrix: matrix, solution: solution}
}


// Helper: random non-zero integer in [-5,5]
function randomNonZero() {
  let x = 0;
  while (x === 0) {
    x = Math.floor(Math.random() * 11) - 5;
  }
  return x;
}

/**
 * Generates or transforms a matrix using randomized Gauss operations.
 *
 * It returns 
 *    the transformed matrix, 
 *    the original solution matrix and 
 *    the solution ("one", "no", "infinite").
 *
 * @param {number[][] | "random"} [solMatrix="random"] A predefined matrix or `"random"` to auto‑generate one.
 *
 * @param {"random" | "one" | "no" | "infinite"} [solution="random"] Desired solution type when generating a random matrix.
 *
 * @param {boolean} [resultCol=false] Whether the matrix includes a result column (augmented matrix).
 *
 * @param {0 | 1 | 2 | 3 |4|5|6} [changeLevel=0]  -
 *       - 0 → no transformation  
 *       - 1 → upward Gauss
 *       - 2 → upward Gauss + shuffle
 *       - 3 → upward Gauss + shuffle + multiply         ↑ solution still recognizable
 *       - 4 → upward Gauss + downward Gauss             ↓ solution usually not recognizable
 *       - 5 → upward Gauss + downward Gauss + shuffle
 *       - 6 → upward Gauss + downward Gauss + shuffle + multiply
 * 
 * @param {number} [maxNum=1] Maximum absolute value for random scalars used in row operations.
 *
 * @param {number[]} [denominator=[1]] Allowed denominators for random fractions (example: [1,1,2,4]).
 *
 * @param {number} [rows=3] Desired number of rows in the final matrix.
 *
 * @param {number} [cols=3] Desired number of columns in the final matrix. (exclusive result col)
 *
 * @returns {number[][]} return.matrix: The transformed matrix after applying Gauss operations.
 *
 * @returns {number[][]} return.solMatrix: The original (or generated) solution matrix before transformations.
 *
 * @returns {"one" | "no" | "infinite"} return.solution: The solution type of the generated matrix.
 */
export async function MatrixCreator({
    solMatrix = "random",
    solution = "random",
    resultCol = false,
    changeLevel = 0,
    maxNum = 1, 
    denominator = [1],
    rows = 3,
    cols = 3
} = {}) {
    if(rows === "random"){
      rows = randomInt(1,4);
    }
    if(cols === "random"){
      cols = randomInt(1,4);
    }
    // solmatrix soll random sein
    if (!Array.isArray(solMatrix)){
        const result = await solMatrixRREF(Math.min(rows,cols),solution,resultCol);
        solMatrix = result.matrix;
        solution = result.solution;
    }
    // no square matrix?
    const diff = cols - rows;
    // adding rows
    if(diff < 0){
        const c = solMatrix[0].length;
        const newRows = Array.from({ length: Math.abs(diff) }, () => 
            Array(c).fill(0) ); 
        solMatrix = [...solMatrix, ...newRows];
    }
    // adding cols
    else if(diff > 0){
        if(solution === "one") solution = "infinite";

        const r = solMatrix.length;
        const newCols = Array.from({ length: r }, () => 
            Array(diff).fill(0) );
        if (!resultCol){
            solMatrix = solMatrix.map((row, i) => [...row, ...newCols[i]]);
        }
        else {
            // before resultCol
            const lastCol = solMatrix[0].length - 1; 
            solMatrix = solMatrix.map((row, i) => { 
                const left = row.slice(0, lastCol); 
                const right = row.slice(lastCol); 
                return [...left, ...newCols[i], ...right]; 
            });
        }
    }
    // ---------------------------------------
    // (0) no transformation
    // ---------------------------------------
    if (changeLevel === 0){
        return {
            matrix: solMatrix,
            solMatrix: solMatrix,
            solution: solution
        };
    }
    // ---------------------------------------
    // (1) upward Gauss
    // ---------------------------------------
    let matrix = gaussUpward(solMatrix, maxNum);
    
    if (changeLevel === 1){
        return {
            matrix: matrix,
            solMatrix: solMatrix,
            solution: solution
        };    
    }

    if (changeLevel <= 3) {
      // ---------------------------------------
      // (2) upward Gauss + shuffle
      // ---------------------------------------
      let shuffle = shuffleRows(matrix);

      if (changeLevel === 2){
          return {
              matrix: shuffle,
              solMatrix: solMatrix,
              solution: solution
          };
      }
      // ---------------------------------------
      // (3) upward Gauss + shuffle + multiply
      // ---------------------------------------
      let multiply = multiplyRows(shuffle, maxNum, denominator);

      if (changeLevel === 3){
          return {
              matrix: multiply,
              solMatrix: solMatrix,
              solution: solution
          };
      }
    }
    // ---------------------------------------
    // (4) upward Gauss + downward Gauss
    // ---------------------------------------
    matrix = gaussDownward(matrix, maxNum);
        
    if(changeLevel === 4) {
      return {
        matrix: matrix,
        solMatrix: solMatrix,
        solution: solution
      };
    }
    // ---------------------------------------
    // (5) upward Gauss + downward Gauss + shuffle
    // ---------------------------------------
    matrix = shuffleRows(matrix);
        
    if(changeLevel === 5) {
      return {
        matrix: matrix,
        solMatrix: solMatrix,
        solution: solution
      };
    }

    // ---------------------------------------
    // (6) upward Gauss + downward Gauss + shuffle + multiply
    // ---------------------------------------
    matrix = multiplyRows(matrix, maxNum, denominator);
        
    return {
      matrix: matrix,
      solMatrix: solMatrix,
      solution: solution
    };
    

}

function randomFraction(maxNum, denominator = [1]){
  maxNum = Math.abs(maxNum);

  let num = 0; 
  while (num === 0) { 
    num = randomInt(-maxNum, maxNum + 1);
  }
  const den = denominator[randomInt(0, denominator.length)];

  return fraction(num, den);
}

function shuffleRows(matrix) {
  let shuffle = matrix.map(row => [...row]);  // deep copy

  for (let i = matrix.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    shuffle = SwitchRows(shuffle,i,j);
  }
  return shuffle;
}

function multiplyRows(matrix, maxNum, denominator) {
  let multiply = matrix.map(row => [...row]);  // deep copy
  for (let i = 0; i < matrix.length; i++) {
    const randMult = randomFraction(maxNum,denominator);
    multiply = MultiplyRow(multiply, i, randMult);
  }
  return multiply;
}

function gaussUpward(matrix, maxNum){
  let upward = matrix.map(row => [...row]);  // deep copy

  for (let i = matrix.length - 1; i >= 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      const randAdd = randomFraction(maxNum);
      upward = AddRows(upward, i, j, randAdd);
    }
  }
  return upward;
}

function gaussDownward(matrix, maxNum){
  let downward = matrix.map(row => [...row]);  // deep copy

  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix.length; j++){
      const randAdd = randomFraction(maxNum);
      downward = AddRows(downward, i, j, randAdd);
    }
  }
  return downward;
}