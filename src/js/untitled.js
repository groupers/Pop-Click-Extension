var getEditDistancec = function(a, b) {
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 
  var matrix = []
  var mx = (b.length > a.length) ? b.length : a.length;
  mx = mx + 1;

  matrix[0] = [0];
  for(mx; -1 < mx; mx-=1){
    if(mx != 0){
      matrix[mx] = [mx];
    }
    matrix[0][mx] = mx;
  }
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }
    return matrix[b.length][a.length];
  }
  console.log(getEditDistancec('cross','crosx'))
