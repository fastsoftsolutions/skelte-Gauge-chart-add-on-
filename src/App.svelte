<!-- App.svelte -->
<svelte:options tag="gauge-component" />
<script lang="ts">
    import {configstore} from './storage.js';
    import { onMount } from 'svelte';
    import { watchResize } from "svelte-watch-resize";
    import Gauge from "./component/Gauge.svelte";
    let gauge;
    let init = true;
    let chartnode = undefined;
    let mainnode = undefined;
    export let value:number=-1;
    export let min:number=-1;
    export let max:number=-1;
    export let unit:string="";
    export let decimals:number=-1;
    export let movechartx:number=-9999999999;
    export let movecharty:number=-9999999999;
    export let commarequired:string="";
    export let label:string="";
    export let valuecolor:string="";
    export let unitcolor:string="";
    export let valueposition:string="";
    export let movevaluetox:number=-9999999999;
    export let movevaluetoy:number=-9999999999;
    export let moveunittox:number=-9999999999;
    export let moveunittoy:number=-9999999999;
    export let shapecover_show:string="false";
    export let shapecover_fill:string="";
    export let shapecover_stroke:string="";
    export let shapecover_shape:string="";
    export let shapecover_adjustwidth:number=-9999999999;
    export let shapecover_adjustheight:number=-9999999999;
    export let shapecover_reducesize_width:number=-9999999999;
    export let shapecover_reducesize_height:number=-9999999999;
    export let gaugeradius:number=-1;
    export let gaugebandheight:number=-1;
    export let movex:number=-9999999999;
    export let movey:number=-9999999999;
    export let movetitlex:number=-9999999999;
    export let movetitley:number=-9999999999;
    export let fillarc_show:string="";
    export let fillarc_color:string="";
    export let fillarc_cutarc:string="";
    export let fillarc_angle_start:number=-9999999999;
    export let fillarc_angle_end:number=-9999999999;
    export let fillarc_angleadd:number=-9999999999;
    export let fillarc_angleadjust:number=-9999999999;
    export let fillarc_curvedarc_show:string="";
    export let fillarc_curvedarc_radius:number=-1;
    export let outerlayerarc_show:string="";
    export let outerlayerarc_fill:string="";
    export let outerlayerarc_width:number=-1;
    export let outerlayerarc_stroke:string="";
    export let outerlayerarc_opacity:number=-1;
    export let outerlayerarc_curvedarcradius:number=-1;
    export let ticks_show:string="";
    export let ticks_count:number=-1;
    export let ticks_color:string="";
    export let ticks_opacity:number=-1;
    export let ticks_width:number=-1;
    export let ticks_length:number=-1;
    export let ticks_type:string="";
    export let ticks_nicedivisor:number=-1;
    export let ticks_showendticks:string="";
    export let ticks_label_show:string="";
    export let ticks_label_labeldecimals:number=-1;
    export let ticks_label_color:string="";
    export let ticks_label_opacity:number=-1;
    export let ticks_label_movetoouter:string="";
    export let ticks_label_movetoouterpos:number=-9999999999;
    export let style_needle_show:string="";
    export let style_needletype:string= "";
    export let style_needleradius:number=-1;
    export let style_needleinnercircleradius:number=-1;
    export let style_labeldisplaytype:string="";
    export let style_needlecolor_fill:string="";
    export let style_needlecolor_stroke:string="";
    export let style_needlecolor_strokewidth:number=-1;
    export let style_needlecirclecolor_fill:string="";
    export let style_needlecirclecolor_stroke:string="";
    export let style_needlecirclecolor_strokewidth:number=-1;
    export let style_needleinnercirclestyle_show:string="";
    export let style_needleinnercirclestyle_fill:string="";
    export let style_needleinnercirclestyle_stroke:string="";
    export let style_needleinnercirclestyle_strokewidth:number=-1;
    export let style_needleheight:number=-1;
    export let style_startangle:number=-1;
    export let style_endangle:number=-1;
    export let style_ring_inset:number=-1;
    export let margin:any={};
    export let ranges:any=[];   
    export let reducer:string="";
    export let animationduration:number=-1;
    const chartObject:any = {
      value:0,
      min:0,
      max:0,
      unit:"",
      decimals:0,
      movechart:{x:0,y:0},
      movetitle:{x:0,y:0},
      commarequired:false,
      label:"",
      valueColor:"rgba(255,255,255,1)",
      unitColor:"rgba(255,255,255,1)",
      valueposition:"center",
      movevalueto:{x:0,y:0},
      moveunitto:{x:0,y:0},
      shapeCover:{show:false,fill:"#ffffff",stroke:"#000000",shape:"circle",reduceSize:{width:0,height:0},adjust:{width:0,height:0}},
      gaugeRadius:100,
      gaugeBandHeight:25,
      moveX:50,
      moveY:50,
      fillarc:{show:true,color:"yellow",cutarc:true,angle:[-105,-75],angleadd:30,angleadjust:0,curvedarc:{show:false,radius:100}},
      outerLayerArc:{show:true,fill:"lightgray",width:10,stroke:"lightgray",opacity:.5,curvedArcRadius:100},
      ticks:{show:true,count:50,color:"#000000",opacity:.5,length:50,type:"nice",niceDivisor:50,showendTicks:false,label:{show:true,labelDecimals:2,color:"#000000",opacity:.5,movetoOuter:false,movetoOuterPos:0}},
      style:{needle:false,needletype:"normal",needleRadius:5,needleInnerCircleRadius:2,labeldisplaytype:"percentage",needleColor:{fill:"rgba(0,0,0,1)",stroke:"rgba(0,0,0,1)",strokeWidth:1},needleCircleColor:{fill:"rgba(255,255,255,1)",stroke:"rgba(0,0,0,1)",strokeWidth:1},needleInnerCircleStyle:{show:true,fill:"rgba(255,255,255,.5)",stroke:"rgba(0,0,0,.5)",strokeWidth:1},needleHeight:.40,startAngle:0,endAngle:180,ringinset:20},
      ranges:[],
      margin:{left:0,right:0,top:0,bottom:0},
      reducer:false,
      animationDuration:0,
      chartholder:null
    };
    onMount(async () => {
      let processed = false;
      if (value > -1){
          chartObject["value"] = parseFloat(value);
          processed = true;
      }
      if (min > -1){
          chartObject["min"] = parseFloat(min);
          processed = true;
      }
      if (max > -1){
          chartObject["max"] = parseFloat(max);
          processed = true;
      }
      if (ranges.length > 0){
          chartObject["ranges"] = JSON.parse(ranges);
          processed = true;
      }
      if (margin.length > 0){
          chartObject["margin"] = JSON.parse(margin);
          processed = true;
      }
      if (unit.length > 0){
          chartObject["unit"] = unit;
          processed = true;
      }
      if (decimals > -1){
          chartObject["decimals"] = parseFloat(decimals);
          processed = true;
      }
      if (movechartx > -9999999999){
          chartObject.movechart.x = parseFloat(movechartx);
          processed = true;
      }
      if (movecharty > -9999999999){
          chartObject.movechart.y = parseFloat(movecharty);
          processed = true;
      }
      if (movetitlex > -9999999999){
          chartObject.movetitle.x = parseFloat(movetitlex);
          processed = true;
      }
      if (movetitlex > -9999999999){
          chartObject.movetitle.y = parseFloat(movetitley);
          processed = true;
      }
      if (commarequired.length > 0){
          chartObject["commarequired"] = commarequired.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (label.length > 0){
          chartObject["label"] = label;
          processed = true;
      }
      if (valuecolor.length > 0){
          chartObject["valueColor"] = valuecolor;
          processed = true;
      }
      if (unitcolor.length > 0){
          chartObject["unitColor"] = unitcolor;
          processed = true;
      }
      if (valueposition.length > 0){
          chartObject["valueposition"] = valueposition;
          processed = true;
      }
      if (movevaluetox > -9999999999){
          chartObject.movevalueto.x = movevaluetox;
          processed = true;
      }
      if (movevaluetoy > -9999999999){
          chartObject.movevalueto.y = movevaluetoy;
          processed = true;
      }
      if (moveunittox > -9999999999){
          chartObject.moveunitto.x = moveunittox;
          processed = true;
      }
      if (moveunittoy > -9999999999){
          chartObject.moveunitto.y = moveunittoy;
          processed = true;
      }
      if (shapecover_show || !shapecover_show ){
          chartObject.shapeCover.show = shapecover_show.toUpperCase() === 'TRUE'?true:false;
          processed = true;
      }
      if (shapecover_fill.length > 0){
          chartObject.shapeCover.fill = shapecover_fill;
          processed = true;
      }
      if (shapecover_stroke.length > 0){
          chartObject.shapeCover.stroke = shapecover_stroke;
          processed = true;
      }
      if (shapecover_shape.length > 0){
          chartObject.shapeCover.shape = shapecover_shape;
          processed = true;
      }
      if (shapecover_reducesize_width > -9999999999){
          chartObject.shapeCover.reduceSize.width = parseFloat(shapecover_reducesize_width);
          processed = true;
      }
      if (shapecover_reducesize_height > -9999999999){
          chartObject.shapeCover.reduceSize.height = parseFloat(shapecover_reducesize_height);
          processed = true;
      }
      if (shapecover_adjustwidth > -9999999999){
          chartObject.shapeCover.adjust.width = parseFloat(shapecover_adjustwidth);
          processed = true;
      }
      if (shapecover_adjustheight > -9999999999){
          chartObject.shapeCover.adjust.height = parseFloat(shapecover_adjustheight);
          processed = true;
      }
      if (gaugeradius > -1){
          chartObject.gaugeRadius = parseFloat(gaugeradius);
          processed = true;
      }
      if (gaugebandheight > -1){ 
          chartObject.gaugeBandHeight = parseFloat(gaugebandheight);
          processed = true;
      }
      if (movex > -9999999999){ 
          chartObject.moveX = parseFloat(movex);
          processed = true;
      }
      if (movey > -9999999999){ 
          chartObject.moveY = parseFloat(movey);
          processed = true;
      }
      if (fillarc_show.length > 0){
          chartObject.fillarc.show = fillarc_show.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (fillarc_color.length > 0){
          chartObject.fillarc.color = fillarc_color;
          processed = true;
      }
      if (fillarc_cutarc.length > 0){
          chartObject.fillarc.cutarc = fillarc_cutarc;
          processed = true;
      }
      if (fillarc_angle_start > -9999999999){ 
          chartObject.fillarc.angle[0] = parseFloat(fillarc_angle_start);
          processed = true;
      }
      if (fillarc_angle_end > -9999999999){ 
          chartObject.fillarc.angle[1] = parseFloat(fillarc_angle_end);
          processed = true;
      }
      if (fillarc_angleadd > -9999999999){ 
          chartObject.fillarc.angleadd = parseFloat(fillarc_angleadd);
          processed = true;
      }
      if (fillarc_angleadjust > -9999999999){ 
          chartObject.fillarc.angleadjust = parseFloat(fillarc_angleadjust);
          processed = true;
      }
      if (fillarc_curvedarc_show.length > 0){
          chartObject.fillarc.curvedarc.show = fillarc_curvedarc_show.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (fillarc_curvedarc_radius > -1){ 
          chartObject.fillarc.curvedarc.radius = parseFloat(fillarc_curvedarc_radius);
          processed = true;
      }
      if (outerlayerarc_show.length > 0){
          chartObject.outerLayerArc.show = outerlayerarc_show.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (outerlayerarc_fill.length > 0){
          chartObject.outerLayerArc.fill = outerlayerarc_fill;
          processed = true;
      }
      if (outerlayerarc_stroke.length > 0){
          chartObject.outerLayerArc.stroke = outerlayerarc_stroke;
          processed = true;
      }
      if (outerlayerarc_width > -1){
          chartObject.outerLayerArc.width = parseFloat(outerlayerarc_width);
          processed = true;
      }
      if (outerlayerarc_opacity > -1){
          chartObject.outerLayerArc.opacity = parseFloat(outerlayerarc_opacity);
          processed = true;
      }
      if (outerlayerarc_curvedarcradius > -1){
          chartObject.outerLayerArc.curvedArcRadius = parseFloat(outerlayerarc_curvedarcradius);
          processed = true;
      }
      if (ticks_show.length > 0){
          chartObject.ticks.show = ticks_show.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (ticks_count > -1){
          chartObject.ticks.count = parseFloat(ticks_count);
          processed = true;
      }
      if (ticks_color.length > 0){
          chartObject.ticks.color = ticks_color;
          processed = true;
      }
      if (ticks_opacity > -1){
          chartObject.ticks.opacity = parseFloat(ticks_opacity);
          processed = true;
      }
      if (ticks_length > -1){
          chartObject.ticks.length = parseFloat(ticks_length);
          processed = true;
      }
      if (ticks_type.length > 0){
          chartObject.ticks.type = ticks_type;
          processed = true;
      }
      if (ticks_nicedivisor > -1){
          chartObject.ticks.niceDivisor = parseFloat(ticks_nicedivisor);
          processed = true;
      }
      if (ticks_showendticks.length > 0){
          chartObject.ticks.showendTicks = ticks_showendticks.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (ticks_label_show.length > 0){
          chartObject.ticks.label.show = ticks_label_show.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (ticks_label_labeldecimals > -1){
          chartObject.ticks.label.labelDecimals = parseFloat(ticks_label_labeldecimals);
          processed = true;
      }
      if (ticks_label_color.length > 0){
          chartObject.ticks.label.color = ticks_label_color;
          processed = true;
      }
      if (ticks_label_opacity >  -1){
          chartObject.ticks.label.opacity = ticks_label_opacity;
          processed = true;
      }
      if (ticks_label_movetoouter.length > 0){
          chartObject.ticks.label.movetoOuter = ticks_label_movetoouter.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (ticks_label_movetoouterpos > -9999999999){
          chartObject.ticks.label.movetoOuterPos = parseFloat(ticks_label_movetoouterpos);
          processed = true;
      }
      if (style_needle_show.length > 0){
          chartObject.style.needle = style_needle_show.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (style_needletype.length > 0){
          chartObject.style.needletype = style_needletype;
          processed = true;
      }
      if (style_needleradius > -1){
          chartObject.style.needleRadius = parseFloat(style_needleradius);
          processed = true;
      }
      if (style_needleinnercircleradius > -1){
          chartObject.style.needleInnerCircleRadius = parseFloat(style_needleinnercircleradius);
          processed = true;
      }
      if (style_labeldisplaytype.length > 0){
          chartObject.style.labeldisplaytype = style_labeldisplaytype;
          processed = true;
      }
      if (style_needlecolor_fill.length > 0){
          chartObject.style.needleColor.fill = style_needlecolor_fill;
          processed = true;
      }
      if (style_needlecolor_stroke.length > 0){
          chartObject.style.needleColor.stroke = style_needlecolor_stroke;
          processed = true;
      }
      if (style_needlecolor_strokewidth > 0){
          chartObject.style.needleColor.strokeWidth = style_needlecolor_strokewidth;
          processed = true;
      }  
      if (style_needlecirclecolor_fill.length > 0){
          chartObject.style.needleCircleColor.fill = style_needlecirclecolor_fill;
          processed = true;
      }  
      if (style_needlecirclecolor_stroke.length > 0){
          chartObject.style.needleCircleColor.stroke = style_needlecirclecolor_stroke;
          processed = true;
      }  
      if (style_needlecirclecolor_strokewidth > -1){
          chartObject.style.needleCircleColor.strokeWidth = style_needlecirclecolor_strokewidth;
          processed = true;
      }
      if (style_needleinnercirclestyle_show.length > 0){
          chartObject.style.needleInnerCircleStyle.show = style_needleinnercirclestyle_show.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (style_needleinnercirclestyle_fill.length > 0){
          chartObject.style.needleInnerCircleStyle.fill = style_needleinnercirclestyle_fill;
          processed = true;
      } 
      if (style_needleinnercirclestyle_stroke.length > 0){
          chartObject.style.needleInnerCircleStyle.stroke = style_needleinnercirclestyle_stroke;
          processed = true;
      } 
      if (style_needleinnercirclestyle_strokewidth > -1){
          chartObject.style.needleInnerCircleStyle.strokeWidth = style_needleinnercirclestyle_strokewidth;
          processed = true;
      }
      if (style_needleheight > -1){
          chartObject.style.needleHeight = style_needleheight;
          processed = true;
      } 
      if (style_startangle > -1){
          chartObject.style.startAngle = style_startangle;
          processed = true;
      }
      if (style_endangle > -1){
          chartObject.style.endAngle = style_endangle;
          processed = true;
      }
      if (parseFloat(style_ring_inset) > -1){
          chartObject.style.ringinset = parseFloat(style_ring_inset);
          processed = true;
      }
      if (reducer.length > 0){
          chartObject.style.reducer = reducer.toUpperCase() === "TRUE"?true:false;
          processed = true;
      }
      if (animationduration > -1){
          chartObject.animationDuration = parseFloat(animationduration);
          processed = true;
      }
      if (processed){
          chartObject.chartholder = chartnode;
          chartObject.mainholder = mainnode;
          configstore.set(chartObject);
      }
    });

    function resizechart(){
        if (!init){
            gauge.resizeChart();
        }  
        init=false;
    }

    function chartholder(node){
        chartnode = node;
    }

    function mainholder(node){
        mainnode = node;
    }
</script>




<template>
   <div use:mainholder>
    <div use:watchResize={resizechart}>
      <div id = "gaugechartholder" use:chartholder>
        <gauge-init> 
          <Gauge bind:this={gauge}/>
        </gauge-init>
      </div>   
    </div>
   </div>
</template>


