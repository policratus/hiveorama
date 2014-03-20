/*
	Statistical library - Hiveorama.com - 2013
*/
function openStats() {
	drawFiveNumTable(stocks);
	drawVisualization(stocks);
	showResults(true);
}

function drawVisualization(data) {
	
	  var fiveNum = FiveNumSumm(data);
	  var labels = fiveNum['labels'];
	  var summary = fiveNum['summary'];
	                  
	  var chartData = new google.visualization.DataTable();
	  
	  chartData.addColumn('string', 'Label');
	  chartData.addColumn('number', 'Min');
	  chartData.addColumn('number', 'Quartile1');
	  chartData.addColumn('number', 'Quartile3');
	  chartData.addColumn('number', 'Max');
	  
	  for (var i = 0 ; i < labels.length ; i++) {
	          auxArray = [];
	          
	          auxArray.push(labels[i]);
	          
	          for (var t = 0 ; t < summary[i].length ; t++) {
	                  if ( t==0 || t==1 || t==3 || t==4) {
	                          auxArray.push(parseFloat(summary[i][t].toFixed(2)));
	                  }
	          }
	 
	          chartData.addRows([auxArray]);
	  }
	  
	  var options = {
	    legend:'none',
	    chartArea:{width:"80%",height:"80%"},
	    backgroundColor: '#FAFAFA'
	  };
	  
	  $('#chart_div').height('400px');
	
	  var chartDiv = document.getElementById('chart_div');
	  var chart = new google.visualization.CandlestickChart(chartDiv);        
	  chart.draw(chartData, options);
 }
 

function drawFiveNumTable(data) {
		  $("#resultSection").animate({height:"950px"}, 1000, function(){
		        var fiveNum = FiveNumSumm(data);
		        var labels = fiveNum['labels'];
		        var summary = fiveNum['summary'];
		        
		        var tab = new google.visualization.DataTable();
		        
		        tab.addColumn('string', 'Label');
		        tab.addColumn('number', 'Minimum');
		        tab.addColumn('number', 'Quartile 1');
		        tab.addColumn('number', 'Average');
		        tab.addColumn('number', 'Quartile 3');
		        tab.addColumn('number', 'Maximum');
		        tab.addColumn('number', 'Sum');
		        tab.addColumn('number', 'Std. Deviation');
		        tab.addColumn('number', 'Variance');
		        
		        for (var i = 0 ; i < labels.length ; i++) {
		                auxArray = [];
		                
		                auxArray.push(stringStripper(labels[i]));
		                
		                for (var t = 0 ; t < summary[i].length ; t++) {
		                        auxArray.push(parseFloat(summary[i][t].toFixed(2)));
		                }
		       
		                tab.addRows([auxArray]);
		        }
		        
		        var fiveNumDiv = document.getElementById('fivenum_div');
		        
		        var table = new google.visualization.Table(fiveNumDiv);
		        table.clearChart();
		        table.draw(tab, {width: '99%', page: 'enable', pageSize: 10, showRowNumber: false});
        });
 }
 
 function FiveNumSumm(data) {
        var results = parseData(data,'vector');
        var labels = results['labels'];
        var vectors = results['vectors'];
        
        var uniqueLabels = labels.unique();
                
        var summary = [], average = 0, variance = 0, groupedVectors = [];
        
        for (var n = 0 ; n < uniqueLabels.length ; n++){
                auxArray = [];
                auxArray.push(uniqueLabels[n]);
                for (var c = 0 ; c < labels.length ; c++){
                        if (labels[c] == uniqueLabels[n]){
                                for (var j = 0 ; j < vectors[c].length ; j++){
                                        auxArray.push(vectors[c][j]);
                                }
                        }
                }
                
                groupedVectors.push(auxArray);
                                
        }
        
        for (var p = 0 ; p < groupedVectors.length ; p++) {
                var auxVector = [], auxArray = [];
                var sum = 0, average = 0, auxVariance = 0, variance = 0;
                
                groupedVectors[p].shift();
                groupedVectors[p].sort();
                
                auxVector.push(groupedVectors[p]);
                
                //Min
                auxArray.push(auxVector[0][0]);
                
                //Q1
                auxArray.push(auxVector[0][Math.floor((1/4)*(auxVector[0].length))]);
                
                for (var h = 0 ; h < auxVector[0].length ; h++){
                        sum += parseFloat(auxVector[0][h]);
                }
                
                average = sum / auxVector[0].length;
                
                //Average
                auxArray.push(average);
                
                //Q3
                auxArray.push(auxVector[0][Math.floor((3/4)*(auxVector[0].length))]);
                
                //Max
                auxArray.push(auxVector[0][auxVector[0].length-1]);
                
                //Sum
                auxArray.push(sum);
                
                for (var i = 0 ; i < auxVector[0].length ; i++) {
                        auxVariance += Math.pow((average-auxVector[0][i]),2);                        
                }
       
                variance = auxVariance / auxVector[0].length; 
                
                //Standard deviation
                auxArray.push(Math.sqrt(variance));
                
                //Variance
                auxArray.push(variance);
                
                summary.push(auxArray);
        }
        
	return {'labels': uniqueLabels , 'summary': summary};
 }
 
 function showResults(decision) {
 	var spanResults = document.getElementById("results");
 	var spantitleTable = document.getElementById("titleTable");
 	var spantitleChart = document.getElementById("titleChart");
 	var barDivider = document.getElementById("divider");
 	var spanClose = document.getElementById("spanClose");
		 	
 	if (decision) {
		 	spanResults.innerHTML = "";
		 	spantitleTable.innerHTML = "";
		 	spantitleChart.innerHTML = "";
		 	
		 	barDivider.style.visibility = "visible";
		 	spanClose.style.visibility = "visible";
		 	
		 	var tag = document.createElement("p");
		 	var textNode = document.createTextNode("Results");
		 	spanResults.appendChild(textNode);
		 	
		 	var tag = document.createElement("p");
		 	var textNode = document.createTextNode("Statistical summary table");
		 	spantitleTable.appendChild(textNode);
		 	
		 	var tag = document.createElement("p");
		 	var textNode = document.createTextNode("Boxplot");
		 	spantitleChart.appendChild(textNode);
	} 
	else {
		 	spanResults.innerHTML = "";
		 	spantitleTable.innerHTML = "";
		 	spantitleChart.innerHTML = "";
		 	
		 	barDivider.style.visibility = "hidden";
		 	spanClose.style.visibility = "hidden";
		 	
		 	var fiveNumDiv = document.getElementById('fivenum_div');		        
		   var table = new google.visualization.Table(fiveNumDiv);
		   table.clearChart();
		   
		   $('#chart_div').empty();
		   $('#chart_div').height('0px');
	}
 }
 
$(document).ready(function() {
   if(isAPIAvailable()) {
     $('#filesFiveNum').bind('change', handleFile);
   }
 });
  
 function handleFile(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    
    if ((file.size / Math.pow(1024,2)) > 1){
        alert("This file size exceeds 1MB. Please, choose a smaller sample.");
    } else {
            
        var reader = new FileReader();
        reader.readAsText(file);

       reader.onload = function(event){
               var csv = event.target.result;
               try {
                       var data = $.csv.toArrays(csv);
                       drawFiveNumTable(data);
                       drawVisualization(data);
                       showResults(true);
               }
               catch (err) {
               		  showResults(false);
               		  
               		  $("#resultSection").animate({height:"0px"}, 1000, function(){               		  
		                       var errorMsg = "There was an error on loading this file.\n";
		                       errorMsg += "Please, load a file with well-formed CSV format specification.\n"
		                       errorMsg += "Here, the error description: " + err;
		                       alert(errorMsg);
                       });                    
               }
       };
    }
}