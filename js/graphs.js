function graphSelector(sample) {
        switch(sample) {
                case 'java':
                        plotGraph(getGEXF('/data/codeminer.gexf'));
                        break;
                case 'celegans':
                        plotGraph(getGEXF('/data/celegans.gexf'));
                        break;                
                case 'social':
                        plotGraph(getGEXF('/data/social.gexf'));
                        break;
                default:
                        break;
        }
}

function getGEXF(path) {
        var xml;
        
        xml = window.XMLHttpRequest ?
                new XMLHttpRequest():
                new ActiveXObject('Microsoft.XMLHTTP');
                
        xml.overrideMimeType('text/xml');
        xml.open('GET', path, false);
        xml.send();
        
        return xml.responseXML;
}

 $(document).ready(function() {
    if(isAPIAvailable()) {
      $('#filesGraph').bind('change', readXMLFile);
    }
  });
  
 function readXMLFile(evt) {
          var file = document.getElementById("filesGraph").files[0];
          
          if (file) {
                  var reader = new FileReader();
                  
                  reader.readAsText(file,"UTF-8");
                  
                  reader.onload = loadedXML;
          }
}

function loadedXML(evt) {
        var fileString = evt.target.result;
        
        if (window.DOMParser) {
                parser = new DOMParser();
                
                xmlFile = parser.parseFromString(fileString,"text/xml");
                
                var fileFirstTag = xmlFile.childNodes[0].tagName;
                
                if (fileFirstTag != "gexf") {
                        $('#graphDiv').empty();
                        
                        $("#resultSection").animate({height:"0px"}, 1000, function(){
                        		  showResults(false);
                        		  
                                alert("Sorry! This file don't seen to be a valid GEXF File\nPlease, try loading another file or try our samples!");
                        });
                }
                else {
                        plotGraph(xmlFile);
                }
        }
}

function plotGraph(file) {
        $("#resultSection").animate({height:"1500px"}, 1000, function(){
                
		        $('#graphDiv').empty();
		        
		        $('#graphDiv').height('600px');
		                
		        var sigInst = sigma.init($('#graphDiv')[0]).drawingProperties({
		                defaultLabelColor: '#000',
		                defaultLabelSize: 14,
		                defaultLabelBGColor: '#000',
		                defaultLabelHoverColor: '#000',
		                labelThreshold: 10,
		                defaultEdgeType: 'curve'
		                }).graphProperties({
		                        minNodeSize: 0.5,
		                        maxNodeSize: 10,
		                        minEdgeSize: 1,
		                        maxEdgeSize: 5
		                }).mouseProperties({
		                maxRatio: 10
		        });
		        
		        sigInst.parseGexf(file);
		                
		        sigInst.bind('overnodes',function(event){
		        var nodes = event.content;
		        var neighbors = {};
		        sigInst.iterEdges(function(e){
		                if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
		                        neighbors[e.source] = 1;
		                        neighbors[e.target] = 1;
		                }
		        }).iterNodes(function(n){
		                if(!neighbors[n.id]){
		                        n.hidden = 1;
		                }else{
		                        n.hidden = 0;
		                }
		        }).draw(2,2,2);
		        }).bind('outnodes',function(){
		                sigInst.iterEdges(function(e){
		                e.hidden = 0;
		        }).iterNodes(function(n){
		                n.hidden = 0;
		        }).draw(2,2,2);
		        });
		          
		        sigInst.draw();
		        
		        var tab = new google.visualization.DataTable();
		        
		        tab.addColumn('number','Nodes count');
		        tab.addColumn('number','Edges count');
		        
		        var graphSumm = [];
		        
		        graphSumm.push(sigInst.getNodesCount());
		        graphSumm.push(sigInst.getEdgesCount());
		                
		        tab.addRows([graphSumm]);
		        
		        var divGraphSumm = document.getElementById("graphSumm");
		        
		        var tableGraphSumm = new google.visualization.Table(divGraphSumm);
		        tableGraphSumm.clearChart();
		        tableGraphSumm.draw(tab, {width: '99%', page: 'disable', pageSize: 10, showRowNumber: false});
		        
		        var tabNodeProperties = new google.visualization.DataTable();
		        
		        tabNodeProperties.addColumn('string','Id');
		        tabNodeProperties.addColumn('string','Node name');
		        tabNodeProperties.addColumn('number','Incidence degree');
		        tabNodeProperties.addColumn('number','Inverse incidence degree');
		        tabNodeProperties.addColumn('number','Node size');
		        
		        for (var i = 0 ; i < sigInst.getNodesCount() ; i++) {
		                var graphNodeProp = [];
		                
		                try {
		                        graphNodeProp.push(sigInst.getNodes(i).id)
		                        graphNodeProp.push(sigInst.getNodes(i).label);
		                        graphNodeProp.push(sigInst.getNodes(i).inDegree);
		                        graphNodeProp.push(sigInst.getNodes(i).outDegree);
		                        graphNodeProp.push(sigInst.getNodes(i).size);
		                        
		                        tabNodeProperties.addRows([graphNodeProp]);
		                } catch (err) {
		                        continue;
		                        }
		        }
		    
		    	  var divNodeProperties = document.getElementById('nodeProperties');
		    
		        var tableNodeProperties = new google.visualization.Table(divNodeProperties);
		        tableNodeProperties.clearChart();
		        tableNodeProperties.draw(tabNodeProperties, {width: '99%', page: 'enable', pageSize: 5, showRowNumber: false});
		        
		        var tabEdgeProperties = new google.visualization.DataTable();
		        
		        tabEdgeProperties.addColumn('string','Id');
		        tabEdgeProperties.addColumn('string','Source node name');
		        tabEdgeProperties.addColumn('string','Target node name');
		        
		        for (var i = 0 ; i < sigInst.getEdgesCount() ; i++) {
		                var graphEdgeProp = [];
		                
		                try {
		                        graphEdgeProp.push(sigInst.getEdges(i).id)
		                        graphEdgeProp.push(sigInst.getNodes(sigInst.getEdges(i).source).label);
		                        graphEdgeProp.push(sigInst.getNodes(sigInst.getEdges(i).target).label);
		                        
		                        tabEdgeProperties.addRows([graphEdgeProp]);
		                } catch (err) {
		                        continue;
		                }
		        }
		        
		        var divEdgeProperties = document.getElementById('edgeProperties');
		        
		        var tableEdgeProperties = new google.visualization.Table(divEdgeProperties);
		        tableEdgeProperties.clearChart();
		        tableEdgeProperties.draw(tabEdgeProperties, {width: '99%', page: 'enable', pageSize: 5, showRowNumber: false});
		        
		        showResults(true);
        });
}

function showResults(decision) {
		var barDivider = document.getElementById("divider");
		var spanPGraphResults = document.getElementById("pgraphresults");
		var spanPGraphSumm = document.getElementById("pgraphSumm");
		var spanPNodeProp = document.getElementById("pNodeProp");
		var spanPEdgeProp = document.getElementById("pEdgeProp");
		var spanPGraphVis = document.getElementById("pGraphVis");
		var spanClose = document.getElementById("spanClose");
		
		if (decision) {
			  
	        barDivider.style.visibility = "visible";
	        spanClose.style.visibility = "visible";
	        
	        spanPGraphResults.innerHTML = "";
	        
	        var pTag = document.createElement("p");
	        var textNode = document.createTextNode("Results");
	        pTag.appendChild(textNode);
	        spanPGraphResults.appendChild(pTag);

	        spanPGraphSumm.innerHTML = "";
	        
	        var pTag = document.createElement("p");
	        var textNode = document.createTextNode("Graph Summary");
	        pTag.appendChild(textNode);
	        spanPGraphSumm.appendChild(pTag);
        
	        spanPNodeProp.innerHTML = "";
	        
	        var pTag = document.createElement("p");
	        var textNode = document.createTextNode("Nodes properties");
	        spanPNodeProp.appendChild(textNode);
	        
	        var spanPEdgeProp = document.getElementById("pEdgeProp");
        
	        spanPEdgeProp.innerHTML = "";
	        
	        var pTag = document.createElement("p");
	        var textNode = document.createTextNode("Edges properties");
	        spanPEdgeProp.appendChild(textNode);
	     
	        spanPGraphVis.innerHTML = "";
	        
	        var pTag = document.createElement("p");
	        var textNode = document.createTextNode("Graph Visualization");
	        spanPGraphVis.appendChild(textNode);
		}
		else {
			
	        barDivider.style.visibility = "hidden";
	        spanClose.style.visibility = "hidden";
        
	        spanPGraphResults.innerHTML = "";
        
	        spanPGraphSumm.innerHTML = "";
       
	        spanPNodeProp.innerHTML = "";
     
	        spanPEdgeProp.innerHTML = "";
	        
	        spanPGraphVis.innerHTML = "";
	        
	        graphDiv.innerHTML = "";
	        
	        var divNodeProperties = document.getElementById('nodeProperties');
		    
		     var tableNodeProperties = new google.visualization.Table(divNodeProperties);
		     tableNodeProperties.clearChart();
		     
		     var divEdgeProperties = document.getElementById('edgeProperties');
		        
		     var tableEdgeProperties = new google.visualization.Table(divEdgeProperties);
		     tableEdgeProperties.clearChart();
		     
		     var divGraphSumm = document.getElementById("graphSumm");
		        
		     var tableGraphSumm = new google.visualization.Table(divGraphSumm);
		     tableGraphSumm.clearChart();
		     
		     $('#graphDiv').empty();
		     $('#graphDiv').height('0px');
		     
		}
}