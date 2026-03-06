// Chuyển vị ma trận
export const transpose = (matrix) => matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));

// Nhân hai ma trận
export const multiply = (A, B) => {
    const result = Array(A.length)
        .fill(0)
        .map(() => Array(B[0].length).fill(0));
    return result.map((row, i) => row.map((_, j) => A[i].reduce((sum, elm, k) => sum + elm * B[k][j], 0)));
};

// Tính định thức của ma trận 3x3
const determinant3x3 = (M) => {
    return (
        M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
        M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
        M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
    );
};

//Nghịch đảo ma trận
export const inverse3x3 = (M) => {
    const det = determinant3x3(M);
    if (Math.abs(det) < 1e-10) return null;

    const invDet = 1 / det;
    return [
        [
            (M[1][1] * M[2][2] - M[1][2] * M[2][1]) * invDet,
            (M[0][2] * M[2][1] - M[0][1] * M[2][2]) * invDet,
            (M[0][1] * M[1][2] - M[0][2] * M[1][1]) * invDet,
        ],
        [
            (M[1][2] * M[2][0] - M[1][0] * M[2][2]) * invDet,
            (M[0][0] * M[2][2] - M[0][2] * M[2][0]) * invDet,
            (M[0][2] * M[1][0] - M[0][0] * M[1][2]) * invDet,
        ],
        [
            (M[1][0] * M[2][1] - M[1][1] * M[2][0]) * invDet,
            (M[0][1] * M[2][0] - M[0][0] * M[2][1]) * invDet,
            (M[0][0] * M[1][1] - M[0][1] * M[1][0]) * invDet,
        ],
    ];
};

export const calculateRegression = (data) => {
  if (data.length < 3) return null;

  const X = data.map(d => [1, d.p, d.a]);
  const Y = data.map(d => [d.f]);

  const XT = transpose(X);
  const XTX = multiply(XT, X);
  const XTX_inv = inverse3x3(XTX);

  if (!XTX_inv) return null;

  const XTY = multiply(XT, Y);
  const beta = multiply(XTX_inv, XTY);

  // Tính R-squared
  const yMean = data.reduce((sum, d) => sum + d.f, 0) / data.length;
  let ssRes = 0;
  let ssTot = 0;

  data.forEach(d => {
    const yPred = beta[0][0] + beta[1][0] * d.p + beta[2][0] * d.a;
    ssRes += Math.pow(d.f - yPred, 2);
    ssTot += Math.pow(d.f - yMean, 2);
  });

  return {
    beta0: beta[0][0],
    beta1: beta[1][0],
    beta2: beta[2][0],
    rSquared: ssTot === 0 ? 0 : 1 - (ssRes / ssTot)
  };
};
