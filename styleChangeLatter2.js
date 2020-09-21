const fs = require("fs");

/*************************************************/
/*関数                                           */
/*************************************************/

var convertImdObjToList = function(imdList, list){
  
  for(name in imdList){
    
    
    if(name == "unknown") continue;
    console.log(name);
    
    if(imdList[name]["layers"]){
      var item = {
        title: name,
        type: "item",
        list: []
      };
      
      for(zRange in imdList[name]["layers"]){
        var zRangeArr = zRange.split("-");
        var minz = zRangeArr[0] * 1;
        var maxz = (zRangeArr[1] * 1) - 1;
        
        var itemLayer = {
          minzoom: minz,
          maxzoom: maxz,
          type: "layer",
          list: [],
          visible: true
        }
        
        for(i in imdList[name]["layers"][zRange]){
          var layerMapbox = imdList[name]["layers"][zRange][i];
          if(!layerMapbox.paint) layerMapbox.paint = {};
          if(!layerMapbox.layout) layerMapbox.layout = {};
          
          var layerStyle = {
            filter: layerMapbox.filter,
            draw: Object.assign(layerMapbox.paint, layerMapbox.layout),
            info: {
              type: layerMapbox.type
            },
            "source-layer": layerMapbox["source-layer"],
            type: layerMapbox.type
          }
          
          itemLayer.list.push(layerStyle);
        }
        
        item.list.push(itemLayer);
        
      }
      
      list.push(item);
    
    }
    
    delete imdList[name]["layers"];
    
    
    if(Object.keys(imdList[name]).length && Object.keys(imdList[name]).length > 1){
    
      var directory = {
        title: name,
        type: "directory",
        list: []
      }
      
      convertImdObjToList(imdList[name], directory.list);
      
      list.push(directory);
      
    }
  
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

var styleList = [];
 
//まとめる
convertImdObjToList(style, styleList)

var resObj = {
  group: "all",
  list: styleList,
  maxNativeZoom: 16,
  title: "変換したもの"
};

var resstring = JSON.stringify(resObj, null, 4);
fs.writeFileSync(outfile, resstring);
fs.writeFileSync(outfile2, resstring);
