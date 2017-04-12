/**
  Applying levenshtein on every substring of a matching the size of b
  @Params {String} a
  @Params {String} b
  Return: minimum levenshtein distance
**/
function pre_lev(a, b) {
  // Current string a index start, 
  // Current string a index finish,    
  // Index of the minimum value,
  // Minimum value
   var current_a_index_s = 0, current_a_index_f = 0, min_i = 0, min_v = Math.abs(levenshtein_distance(a,b));
   if(a.length > b.length) {
     for(i=0, difference =(a.length-b.length); i<difference+1; i++) {
       current_a_index_s = i
       current_a_index_f = ((b.length)+i)
       result = Math.abs(levenshtein_distance(a.substring(current_a_index_s,current_a_index_f), b))
       if(min_v > result) {
         min_v = result
         min_i = current_a_index_s
       }
     }
   }
   return min_v
}

/**
  Calculates levenshtein distance
  @Params {String} a
  @Params {String} b
  Return: Levenshtein distance of a and b.
**/
function levenshtein_distance(a, b) {
  // Setting a value too high for the levenshtein distance to be considered meaningful.
  if(typeof a == 'undefined' || typeof b == 'undefined') return 9000;
  //If a string has no length then we return the length of other string.
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length;
  // Initialising pointers and 2d array2d
  var array2d = [[0]], i = 0, j = 0;
  // Populating one dimension of the array2d with size of string b
  for(i, bl = b.length; i <= bl; i++){
    array2d[i] = [i];
  }
  // Populating the first column of the array2d with size of string a
  for(j, al = a.length; j <= al; j++){
    array2d[0][j] = j;
  }
  for(i = 1, bl = b.length; i <= bl; i++){
    for(j = 1, al = a.length; j <= al; j++){
      // If both characters match set the diagnol value of the current item to the previous item indexed at -1 diagonally
      if(b.charAt(i-1) == a.charAt(j-1)){
        array2d[i][j] = array2d[i-1][j-1];
      } else {
          array2d[i][j] = Math.min(Math.min(array2d[i][j-1] + 1,array2d[i-1][j] + 1), array2d[i-1][j-1] + 1);
        }
      }
    }
    return array2d[b.length][a.length];
  }
