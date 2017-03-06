
// Compute the edit distance between the two given strings
//Computes the levenstein Distance

// Initializes a new instance of the StringBuilder class
// and appends the given value if supplied
function StringBuilder(value)
{
  this.strings = new Array("");
  this.append(value);
}

// Appends the given value to the end of this instance.
StringBuilder.prototype.append = function (value)
{
  if (value)
  {
    this.strings.push(value);
  }
}

// Clears the string buffer
StringBuilder.prototype.clear = function ()
{
  this.strings.length = 1;
}

// Converts this instance to a String.
StringBuilder.prototype.toString = function ()
{
  return this.strings.join("");
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
// Fill in the rest of the matrix
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
