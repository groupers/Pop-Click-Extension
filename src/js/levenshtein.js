 // For testing
 //  if(min_v < 3 && min_v >= 0){
 //    console.log('v------v')
 //    console.log(a)
 //    console.log(a.substring(min_i,min_i+b.length))
 //    console.log(min_v)
 //    console.log('^------^')
 // }

/**
  Applying levenshtein on every substring of a matching the size of b
  params: String a, String b
  Return: minimum levenshtein distance
**/
function pre_lev(a,b){
  // Current string a index start, 
  // Current string a index finish,    
  // Index of the minimum value,
  // Minimum value
   var ca_i_s = 0, ca_i_f = 0, min_i = 0, min_v = Math.abs(levenshtein_distance_a(a,b));
   if(a.length > b.length){
     for(i=0;i<(a.length-b.length)+1;i++){
       ca_i_s = i
       ca_i_f = ((b.length)+i)
       result = Math.abs(levenshtein_distance_a(a.substring(ca_i_s,ca_i_f),b))
       if(min_v > result){
         min_v = result
         min_i = ca_i_s
       }
     }
     return min_v
   } else{
     return levenshtein_distance_a(a,b)
   }

}
function levenshtein_distance_a (a, b) {
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length;
  var matrix = []
  var i = 0;
  matrix[0] = [0];
  for(i, bl = b.length; i <= bl; i++){
    matrix[i] = [i];
  }
  var j = 0;
  for(j, al = a.length; j <= al; j++){
    matrix[0][j] = j;
  }
  for(i = 1, bl = b.length; i <= bl; i++){
    for(j = 1, al = a.length; j <= al; j++){
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
