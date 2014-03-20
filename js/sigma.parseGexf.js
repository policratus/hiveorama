// Based on parseGexf.js by Mathieu Jacomy @ Sciences Po Médialab & WebAtlas
sigma.publicPrototype.parseGexf = function(gexf) {
  var sigmaInstance = this;

  var viz='http://www.gexf.net/1.2draft/viz'; // Vis namespace
  var i, j, k;

  var nodesAttributes = [];
  var edgesAttributes = [];
  var attributesNodes = gexf.getElementsByTagName('attributes');
  
  for(i = 0; i<attributesNodes.length; i++){
    var attributesNode = attributesNodes[i];
    if(attributesNode.getAttribute('class') == 'node'){
      var attributeNodes = attributesNode.getElementsByTagName('attribute');
      for(j = 0; j<attributeNodes.length; j++){
        var attributeNode = attributeNodes[j];
        
        var id = attributeNode.getAttribute('id'),
          title = attributeNode.getAttribute('title'),
          type = attributeNode.getAttribute('type');
        
        var attribute = {id:id, title:title, type:type};
        nodesAttributes.push(attribute);
        
      }
    } else if(attributesNode.getAttribute('class') == 'edge'){
      var attributeNodes = attributesNode.getElementsByTagName('attribute');
      for(j = 0; j<attributeNodes.length; j++){
        var attributeNode = attributeNodes[j];  // Each xml node 'attribute'
        
        var id = attributeNode.getAttribute('id'),
          title = attributeNode.getAttribute('title'),
          type = attributeNode.getAttribute('type');
          
        var attribute = {id:id, title:title, type:type};
        edgesAttributes.push(attribute);
        
      }
    }
  }
  
  var nodes = [];
  var nodesNodes = gexf.getElementsByTagName('nodes')
  
  for(i=0; i<nodesNodes.length; i++){
    var nodesNode = nodesNodes[i];
    var nodeNodes = nodesNode.getElementsByTagName('node');

    for(j=0; j<nodeNodes.length; j++){
      var nodeNode = nodeNodes[j];
      
      window.NODE = nodeNode;

      var id = nodeNode.getAttribute('id');
      var label = nodeNode.getAttribute('label') || id;
      
      //viz
      var size = 1;      
      var x = Math.random();
      var y = Math.random();
      var color;

      var poorBrowserXmlNsSupport = (nodeNode.getElementsByTagNameNS == null);

      var sizeNodes = nodeNode.getElementsByTagName('size');
      sizeNodes = sizeNodes.length || poorBrowserXmlNsSupport ?
                  sizeNodes :
                  nodeNode.getElementsByTagNameNS('*','size');
      if(sizeNodes.length>0){
        sizeNode = sizeNodes[0];
        size = parseFloat(sizeNode.getAttribute('value'));
      }

      var positionNodes = nodeNode.getElementsByTagName('position');
      positionNodes = positionNodes.length || poorBrowserXmlNsSupport ?
                      positionNodes :
                      nodeNode.getElementsByTagNameNS('*','position');
      if(positionNodes.length>0){
        var positionNode = positionNodes[0];
        x = parseFloat(positionNode.getAttribute('x'));
        y = parseFloat(positionNode.getAttribute('y'));
      }

      var colorNodes = nodeNode.getElementsByTagName('color');
      colorNodes = colorNodes.length || poorBrowserXmlNsSupport ?
                   colorNodes :
                   nodeNode.getElementsByTagNameNS('*','color');
      if(colorNodes.length>0){
        colorNode = colorNodes[0];
        color = '#'+sigma.tools.rgbToHex(parseFloat(colorNode.getAttribute('r')),
                                         parseFloat(colorNode.getAttribute('g')),
                                         parseFloat(colorNode.getAttribute('b')));
      }
      else {
        color = 'rgb('+Math.round(Math.random()*256)+','+
                       Math.round(Math.random()*256)+','+
                       Math.round(Math.random()*256)+')';
      }
      
      var node = {label:label, size:size, x:x, y:y, attributes:[], color:color};
      
      var attvalueNodes = nodeNode.getElementsByTagName('attvalue');
      for(k=0; k<attvalueNodes.length; k++){
        var attvalueNode = attvalueNodes[k];
        var attr = attvalueNode.getAttribute('for');
        var val = attvalueNode.getAttribute('value');
        node.attributes.push({attr:attr, val:val});
      }

      sigmaInstance.addNode(id,node);
    }
  }

  var edges = [];
  var edgesNodes = gexf.getElementsByTagName('edges');
  for(i=0; i<edgesNodes.length; i++){
    var edgesNode = edgesNodes[i];
    var edgeNodes = edgesNode.getElementsByTagName('edge');
    for(j=0; j<edgeNodes.length; j++){
      var edgeNode = edgeNodes[j];
      var id = edgeNode.getAttribute('id');
      var source = edgeNode.getAttribute('source');
      var target = edgeNode.getAttribute('target');
      var label = edgeNode.getAttribute('label');
      var edge = {
        id:         id,
        sourceID:   source,
        targetID:   target,
        label:      label,
        attributes: []
      };

      var weight = edgeNode.getAttribute('weight');
      if(weight!=undefined){
        edge['weight'] = weight;
        edge['size'] = weight;
      }

      var attvalueNodes = edgeNode.getElementsByTagName('attvalue');
      for(k=0; k<attvalueNodes.length; k++){
        var attvalueNode = attvalueNodes[k];
        var attr = attvalueNode.getAttribute('for');
        var val = attvalueNode.getAttribute('value');
        edge.attributes.push({attr:attr, val:val});
      }

      sigmaInstance.addEdge(id,source,target,edge);
    }
  }
};
