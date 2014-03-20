/*
	Main library - Hiveorama.com - 2013
*/
 
//Unique prototype
Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

//Parse data
function parseData(data,parseType) {
	var labels = [] ;
	var vectors = [] ;
	
	switch(parseType) {
	        case 'textarea':
	                lines = data.split("\n") ;
                	for (var i = 0 ; i < lines.length ; i++) {
                		if (lines[i].length == 0)
                			continue ;
                		var elements = lines[i].split(",") ;
                		var label = elements.shift() ;
                		var vector = [];
                		for (j = 0 ; j < elements.length ; j++)
                			vector.push(parseFloat(elements[j])) ;
                		vectors.push(vector) ;
                		labels.push(label) ;
                	}
                        break;
                case 'vector':
                        for (var i = 0 ; i < data.length ; i++) {
                                var vector = [];
                                for (var h = 0 ; h < data[i].length ; h++) {
                                        if (h == 0) {
                                                var label = data[i][h];
                                        }
                                        else {
                                                vector.push(parseFloat(data[i][h]));
                                        }                                       
                                }
                        
                        labels.push(label);
                        vectors.push(vector);
                        }
                        break;
                default:
                        break;
	}

	return {'labels': labels , 'vectors': vectors} ;
}

// File API Availability
function isAPIAvailable() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      return true;
    } else {
    	alert("Maybe you are using an outdated or non-compliant HTML5 browser. Please, change or update your browser.")
      return false;
    }
  }
  
//String Stripper 
function stringStripper(str) {
 		if (str.length >= 16) {
       		return str.substring(0,16) + "...";
      }
   	else {
				return str;
      }
 }
 
 //Close results
 function closeResults() {
	 $("#resultSection").animate({height:"0px"}, 1000, function(){               		  
           showResults(false);
     });
}