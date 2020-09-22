const fs = require("fs");

/*************************************************/
/*関数                                           */
/*************************************************/

var addLayerToParent = function(parent, layer, i=0){
  
  console.log(i);
  var paths = layer.metadata.path.split("-");
  
  if(!parent[paths[i]]) parent[paths[i]] = {};
  
  if(paths[i + 1]){
  
    addLayerToParent(parent[paths[i]], layer, i+1);
  
  }else{
  
    if(!parent[paths[i]]["layers"]) parent[paths[i]]["layers"] = {};
    
    //ZLとfilter条件で分離する
    var minz = layer.minzoom ? layer.minzoom : 4;
    var maxz = layer.maxzoom ? layer.maxzoom : 18;
    var zlRange = minz + "-" + maxz + "-" + JSON.stringify(layer.filter);
    if(!parent[paths[i]]["layers"][zlRange]) parent[paths[i]]["layers"][zlRange] = [];
    
    parent[paths[i]]["layers"][zlRange].push(layer);
    
  }
}


/*************************************************/
/*実行                                           */
/*************************************************/

//入出力・処理
var infile = process.argv[2];
var outfile = process.argv[3];
if(!outfile) outfile = "test.json";
var outfile2 = "docs/data/" + outfile;

var content = fs.readFileSync(infile).toString();
var style = JSON.parse(content);

var intermediateObj = {};
 
//まとめる
for(i in style.layers){
  if(!style.layers[i].metadata) style.layers[i].metadata = {};
  if(!style.layers[i].metadata.path) style.layers[i].metadata.path = "unknown";
  style.layers[i].metadata.zIndex = i * 1;
  style.layers[i].metadata.group = "all";
  addLayerToParent(intermediateObj, style.layers[i], 0, i);
  console.log(style.layers[i].metadata.path);
}

var resstring = JSON.stringify(intermediateObj, null, 4);
fs.writeFileSync(outfile, resstring);

