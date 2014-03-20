var selectedNumberofClusters = 2;
var globalClusters, globalLabels, globalVectors = [];

$(document).ready(function() {
   if(isAPIAvailable()) {
     $('#filesClustering').bind('change', handleFile);
   }
 });
 
function handleFile(evt) {
    var files = evt.target.files;
    var file = files[0];

    if ((file.size / Math.pow(1024,2)) > 1){
        alert("This file size exceeds 1MB. Please, choose a smaller sample.");
    } else {
            
        try {
                loadTextArea(file);
        }
        catch (err) {
                var errorMsg = "There was an error on loading this file.\n";
                errorMsg += "Please, load a file with well-formed CSV format specification."
                alert(errorMsg);
        }
    }
}

function loadTextArea(file) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event){
      		  try {
              
		              var csv = event.target.result;
		              
		              var data = $.csv.toArrays(csv);
		              
		              for(var row in data)
		              {
		                   document.getElementById("dataarea").value = data.join("\n");
		              }
              }
          	  catch (err) {
          	  		  var errorMsg = "There was an error on loading this file.\n";
                    errorMsg += "Please, load a file with well-formed CSV format specification.\n"
                    errorMsg += "Here, the error description: " + err;
                    alert(errorMsg);
          	  }
      };   
 }

function updateSample(sample) {

		var dataArea = document.getElementById("dataarea");
		
		dataArea.value = datatocluster[sample];
}

function selectNumberofClusters(num) {
		selectedNumberofClusters = num;
}

function openClusters() {
   if (document.getElementById('dataarea').value == "") {
	    alert("Well... it's impossible to cluster \"The Void\". Try to put something to cluster!");
	} else {
	      var data = parseData (document.getElementById('dataarea').value,'textarea') ;
        	var vectors = data['vectors'];
        	var labels = data['labels'];    	
        	var K = parseInt(selectedNumberofClusters);
        	try {
          	     var clusters = figue.kmeans(K , vectors);
          	} catch (err) {
          	      var errMsg = "Opsss. Something gone wrong.\n";
          	      errMsg += " Please, verify if the loaded file is a well-formed CSV.";
          	      alert(errMsg);
          	}
        	
        	var txt = "";
        	var distinctClusters = [];
        	
        	clearClusterDrops();
        	
        	if (clusters) {
        	        
        	        distinctClusters = clusters.assignments.unique();
        	        
                        var select = document.getElementById("clusterDrops");
        	        
                        for (var i = 0 ; g = distinctClusters.length, i < g; i++){
                                var option = document.createElement("option");
                                option.text = "Cluster: " + distinctClusters[i];
                                if (distinctClusters[i] == 0) {
                                        select.add(option, null);
                                } else {
                                        select.add(option, distinctClusters[i]-1);
                                }
                        }
               
            select.style.visibility="visible";
            document.getElementById('dataarea').innerHTML = "";

				globalClusters = clusters;
        		globalLabels = labels;
        		globalVectors = vectors;        		
        		
        		$("#resultSection").animate({height:"550px"}, 1000, function(){
	        		drawTable(0);
	        		showResults(true);
        		});
        		
            } else {
						txt = "Perhaps the file you loaded is not a well-formed CSV,\n";
						txt += " or too many clusters/too few different instances\n";
						txt += " (try changing).";
						alert(txt);
						document.getElementById("clusterDrops").style.visibility = "hidden";
                }
       }
}

function clearClusterDrops() {
        var select = document.getElementById("clusterDrops");
       
        if (select.options.length != 0) {
                for (var i = select.options.length ; i >= 0 ; i--) {
                        select.remove(i);
                }
        }        
}

 function buttonTracking(eventName){
         switch(eventName) {
                 case 'kmeans':
                        _gaq.push(['_trackEvent', 'Clustering App', 'Click', 'Cluster it!']);
                        break;
                 default:
                        break;
         }
 }
 
 function drawTable(clusterId) { 		  
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Label');
        
        for (var i = 0 ; i < globalVectors[0].length ; i++){
                data.addColumn('number','Value ' + i);
        }
        
        for (var c = 0 ; c < globalClusters.assignments.length ; c++){
                auxArray = [];
                
	        if (globalClusters.assignments[c] == clusterId){	            
                        auxArray.push(globalLabels[c]);
	                    
                        for (var h = 0 ; h < globalVectors[c].length ; h++){
                                auxArray.push(parseFloat(globalVectors[c][h].toFixed(2)));
                        }
                
                        data.addRows([auxArray]);
	        } 
	    }
        
        var tableDiv = document.getElementById('table_div');
        
        var table = new google.visualization.Table(tableDiv);
        table.clearChart();
        
        $('#table_div').height('450px');
        
        table.draw(data, {width: '99%', page: 'enable', pageSize: 10, showRowNumber: false});
 }
 
 function showResults(decision) {
 	var spanResults = document.getElementById("results");
 	var spantitleClusterSel = document.getElementById("titleClusterSel");
 	var barDivider = document.getElementById("divider");
 	var selectClusterDrops = document.getElementById("clusterDrops");
 	var textDataArea = document.getElementById("dataarea");
 	
 	if (decision) {
		 	spanResults.innerHTML = "";
		 	spantitleClusterSel.innerHTML = "";
		 	
		 	barDivider.style.visibility = "visible";
		 	spanClose.style.visibility = "visible";
		 	
		 	var tag = document.createElement("p");
		 	var textNode = document.createTextNode("Results");
		 	spanResults.appendChild(textNode);
		 	
		 	var tag = document.createElement("p");
		 	var textNode = document.createTextNode("Select the cluster: ");
		 	spantitleClusterSel.appendChild(textNode);
	} else {
			spanResults.innerHTML = "";
			spantitleClusterSel.innerHTML = "";
			
			barDivider.style.visibility = "hidden";
			spanClose.style.visibility = "hidden";
			selectClusterDrops.style.visibility = "hidden";
			
			var tableDiv = document.getElementById('table_div');
		        
         var table = new google.visualization.Table(tableDiv);
         table.clearChart();
         
         $('#table_div').height('0px');
         textDataArea.value = "";
	}
 }