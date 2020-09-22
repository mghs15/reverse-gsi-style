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
        group: [
          "back"
        ],
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
          visible: true,
          filter: []
        }
        
        for(i in imdList[name]["layers"][zRange]){
          var layerMapbox = imdList[name]["layers"][zRange][i];
          if(!layerMapbox.paint) layerMapbox.paint = {};
          if(!layerMapbox.layout) layerMapbox.layout = {};
          
          itemLayer.filter = layerMapbox.filter;//これは、ZL帯まで同じだが、filter条件が異なる場合にうまくいかない。
          
          //このlayerStyleをジオメトリタイプごとに変えればよい？
          var layerStyle = {
            draw: Object.assign(layerMapbox.paint, layerMapbox.layout),
            info: {
              type: layerMapbox.type
            },
            "source-layer": layerMapbox["source-layer"],
            type: layerMapbox.type,
            minzoom: layerMapbox.minzoom * 1,
            maxzoom: (layerMapbox.maxzoom * 1) - 1
          }
          
          
          //"test-field"関係　ほぼ決め打ち
          if(layerMapbox.type == "symbol"){
            
            if(layerMapbox.layout["text-field"]){
              
              var text_field = layerMapbox.layout["text-field"];
              console.log(text_field);
              console.log(text_field.length);
              
              if(text_field[0] == "get"){
                text_field = text_field[1];
                console.log("GET");
              }else if(text_field[0] == "format"){
                text_field = "knj";//決め打ち
                console.log("FORMAT");
              }else if(text_field[0] == "to-string"){
                var textFieldRound = (text_field[1][0] == "case") ? 10 : 1;
                text_field = "alti";//決め打ち
                console.log("NUMBER:" + textFieldRound);
              }else if( JSON.stringify(text_field).match(/^\"\{.*\}\"$/) ){
                var text_field = JSON.stringify(text_field).replace("\"{", "").replace("}\"", "");
                console.log("{...}:" + text_field);
              }
              
              layerStyle.info = Object.assign(layerStyle.info, {
                "text-anchor-field": "dspPos",
                "text-field": text_field, //ここの指定がきつい
                "text-rotate-field": "arrngAgl",
                "text-vertical-field": "arrng"
              });
              
              if( textFieldRound ){
                layerStyle.info["text-field-round"] = textFieldRound * 1;
                delete layerStyle.info["text-anchor-field"];
                delete layerStyle.info["text-rotate-field"];
                delete layerStyle.info["text-vertical-field"]; //"text-vertical-field"を消さないと、"text-field-round"が機能しない
              }
              
              delete layerStyle.draw["text-field"];
              delete layerStyle.draw["text-rotate"];
              
              
            }//text_fieldあり
            
          }//symbol
          
          if(layerMapbox.metadata["line-role"] && layerMapbox.metadata["line-role"] == "outline"){
            layerStyle.draw["line-role"] = layerMapbox.metadata["line-role"];
          }
          
          itemLayer.list.push(layerStyle);
          
          //"item"について、source-layerに応じてgroupを設定する（決め打ち）
          switch(layerMapbox["source-layer"]) {
            case "symbol":
            case "label":
            case "transp":
            case "elevation":
              item.group = ["symbol"];
              break;
            case "railway":
            case "road":
            case "transl":
            case "searoute ":
              item.group = ["transport", "transport-outline"];
              break;
            default:
              item.group = ["back"];
          }
          
        }//for
        
        item.list.push(itemLayer);
        
        if(!layerMapbox.metadata["line-role"] || layerMapbox.metadata["line-role"] != "outline"){
          if(item.zIndex){
            item.zIndex = layerMapbox.metadata.zIndex ? layerMapbox.metadata.zIndex : 10000;
          }
        }
        
      }//for zRange
      
      list.push(item);
    
    }//if layers
    
    delete imdList[name]["layers"];
    
    
    if(Object.keys(imdList[name]).length && Object.keys(imdList[name]).length > 1){
    
      var directory = {
        title: name,
        type: "directory",
        list: []
      };
      
      convertImdObjToList(imdList[name], directory.list);
      
      list.push(directory);
      
    }
  
  }//for name
  
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
  group: [
    { 
      "id":"back",
      "title":"その他",
      "editZIndex":true
    },
    {
      "id":"transport-outline",
      "title":"交通-枠線",
      "filter":[["==","line-role","outline"]],
      "editZIndex": true
    },
    {
      "id":"transport",
      "title":"交通",
      "hasOutline":true,
      "editZIndex": true
    },
    { 
      "id":"symbol",
      "title":"シンボル",
      "editZIndex":true
    }
  ],
  list: styleList,
  maxNativeZoom: 16,
  title: "変換したもの"
};

var resstring = JSON.stringify(resObj, null, 4);
fs.writeFileSync(outfile, resstring);
fs.writeFileSync(outfile2, resstring);
