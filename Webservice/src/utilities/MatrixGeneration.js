import { SwitchRows, MultiplyRow, AddRows } from "../utilities/CalcFunctions";
import { fraction, randomInt } from "mathjs";

export async function solMatrixRREF(
  dimension = "random", 
  solution = "random",
  resultCol = false,
  zeroCols = true,
  maxNum = 1, 
){
  const rawData = await fetch(`/data/challenge/matrix_rref.json`);
  const data = await rawData.json();
  const possibilities = data[0].dimension;

  // ----------------------
  // dimension 
  if (![1, 2, 3].includes(dimension)) {
    dimension = randomInt(1,4);
  }
  // ----------------------
  // solution 
  if (!["no","one","infinite"].includes(solution)){
    const rand = randomInt(3);
    solution = ["no", "one", "infinite"][rand];
  }
  // dim 1 + zeroCols false, only possibible with "one"
  if (dimension === 1 && zeroCols === false) { 
    solution = "one";
  }
  // no solution only possibible with resultCol
  if (solution === "no" && !resultCol){
    const rand = randomInt(2);
    solution = ["infinite", "one"][rand];
  }

  // ----------------------
  // random matrix
  let matrix;
  if (solution === "one") {
    const list = possibilities[dimension].solution.one;
    matrix = list[randomInt(list.length)];
  }
  else { // no or infinite
    const inf = possibilities[dimension].solution.infinite;
    const list = zeroCols ? inf.withZeroCols : inf.noZeroCols;
    matrix = list[randomInt(list.length)];
  }
  // ----------------------
  // add resultCol
  if (resultCol){
    matrix = matrix.map(row => [...row, randomInt(-5,10)]);
  }
  else {
    return {matrix: matrix, solution: solution}
  }

  // ---------------------
  // no/infinite: handle zero rows
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
          matrix[i][matrix[i].length - 1] = randomFraction(maxNum);

          const rand = randomInt(3);
          if (rand === 0) break;
        }
      }
    }
  }

  return {matrix: matrix, solution: solution}
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
 * @param {number[]} [transformations=[]] Individual matrix transformation sequence (example: [0,1,2,3])
 * 
 * - 0: upward Gauss
 * - 1: downward Gauss
 * - 2: shuffle
 * - 3: multiply
 * 
 * solution still recognizable: [0,2,3]
 * 
 * @param {number} [maxNum=1] Maximum absolute value for random scalars used in row operations.
 *
 * @param {number[]} [denominator=[1]] Allowed denominators for random fractions (example: [1,1,2,4]).
 *
 * @param {number | "random"} [rows=3] Desired number of rows in the final matrix.
 *
 * @param {number | "random"} [cols=3] Desired number of columns in the final matrix. (exclusive result col)
 * 
 * @param {boolean} [zeroCols=true] Can there be zero columns?
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
    transformations = [],
    maxNum = 1, 
    denominator = [1],
    rows = 3,
    cols = 3,
    zeroCols = true
} = {}) {
    if(rows === "random"){
      rows = randomInt(1,4);
    }
    if(cols === "random"){
      cols = randomInt(1,4);
    }
    // solmatrix soll random sein
    if (!Array.isArray(solMatrix)){
        const result = await solMatrixRREF(Math.min(rows,cols),solution,resultCol,zeroCols, maxNum);
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
    // -----------------------------------
    // transformations
    // -----------------------------------
    let matrix = solMatrix.map(row => [...row]);  // deep copy

    for (const value of transformations) {
      switch (value){
        case 0:
          matrix = gaussUpward(matrix, maxNum);
          break;
        case 1:
          matrix = gaussDownward(matrix, maxNum);
          break;
        case 2:
          matrix = shuffleRows(matrix);
          break;
        case 3:
          matrix = multiplyRows(matrix, maxNum, denominator);
          break;
      }
    }
    return {
            matrix: matrix,
            solMatrix: solMatrix,
            solution: solution
    };
}

function randomFraction(maxNum, denominator = [1]){
  if (maxNum !== 0) maxNum = Math.abs(maxNum);
  else return 1;

  let num = 1;
  const rand = randomInt(2);
  // negative or positive
  if (rand === 0) num = randomInt(1,maxNum+1);
  else num = randomInt(-maxNum,0);
 
  const den = denominator[randomInt(denominator.length)];

  return fraction(num, den);
}

function shuffleRows(matrix) {
  let shuffle = matrix.map(row => [...row]);  // deep copy

  for (let i = matrix.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
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
