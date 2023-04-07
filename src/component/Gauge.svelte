<svelte:options tag="gauge-init"/>
<script lang="typescript"> 
   import {configstore} from '../storage.js'
   import * as d3 from 'd3';
   let  params = $configstore;
   let gauge;   
   export class gaugeChart{
       minvalue:number = 0;
       maxvalue:number = 0; 
       range:number = undefined;
       r:number = undefined;
       pointerHeadLength:number = undefined;
       value:number = 0;

       svg:any = undefined;
       g:any = undefined;
       gcircle:any = undefined;
       arc:any = undefined;
       garc:any = undefined;
       scale:any = undefined;
       ticks:any = undefined;
       tickData:any = []
       tickArcs:any = [];
       pointer:number = undefined;   
       arcData:any = undefined;   
       arcDraw:any = undefined;
       gaugeArcs:any = undefined;
       arcCDraw:any = undefined;
       needle:any = undefined;
       cummValue:number = 0;
       config:any = {}; 
       centerX:number = 0;
       centerY:number = 0;
       labels:any = undefined;
       ticklines:any = undefined;
       angles:any = undefined;
       runarcDraw:any = undefined;
       marc:any = undefined;
       movearc:any = undefined;
       farc:any = undefined;
       endticks:any = [];
       needleg:any = undefined;
       needlepath:any = undefined;
       elem:any = undefined;
//       elem:any = document.querySelector("gauge-component").shadowRoot.querySelector("#gaugechartholder").querySelector("gauge-init").shadowRoot.querySelector("#guagechart");

       public constructor(element:string,config:any){
          if (Object.keys(params) > 0){
              this.config = this.setConfig(element,params);
              setTimeout(()=>{
                d3.select(params.chartholder).style("width",window.innerWidth+"px");
                d3.select(params.chartholder).style("height",window.innerHeight+"px");
                this.generateGauge(element,this.config) 
              },1000);    
          }
       } 

       public setConfig(element:string,config:any){
          this.centerX = 0;
          this.centerY = 0;
          let chartSize = window.innerWidth - config.margin.left-config.margin.right - 150;
          if (config.gaugeRadius){
              chartSize = config.gaugeRadius;
          }else{ 

          } 
          if (!config.gaugeBandHeight){          
              config.innerRadius = chartSize/2;
          }else{
              config.innerRadius = config.gaugeBandHeight;
          }
          config.outerRadius = chartSize;
          config.radius = chartSize/2;
          if (!config.gaugeBandHeight){  
               config.ringWidth = 50;
          }else{
               config.ringWidth = config.gaugeBandHeight;           
          }
          config.chartWidth = chartSize;
          config.pointerHeadLength = Math.round(config.radius * config.pointerHeadLengthPercent);
          config.ringInset = config.style.ringinset;
          config.needle = config.style.needle;
          if (config.outerLayerArc.show){
              config.labelInset = (config.outerRadius + config.innerRadius + config.outerLayerArc.width + 50) * .24;
          }else{
              config.labelInset = (config.outerRadius + config.innerRadius + 50) * .24;
          }     
          config.style.minAngle = -90;
          let totalvalue:number = d3.max(config.ranges,(data:any)=>Number(data.to));
          if (totalvalue < config.max){
              config.ranges.push({added:true,from:totalvalue+1,to:config.max,color:"#ffff00",opacity:.2});
              totalvalue = d3.max(config.ranges,(data:any)=>Number(data.to));
          }
          let start = 0;
          if (config.style.needleHeight){
               config.needleHeight = config.style.needleHeight * chartSize;
          }else{
               config.needleHeight = config.outerRadius;
          }     
          config.needleRadius = config.style.needleRadius || 0; 
          config.element = element;
          config.angleRange = config.style.endAngle - config.style.startAngle;
          config.ranges.map((range:any)=>{
            range.fromperc = start;
            range.toperc = Math.round((range.to/totalvalue) * 100);
            if (!range.fromperc){
                range.avalue = (range.toperc-range.fromperc)/100;
            }else{
                range.avalue = ((range.toperc-range.fromperc)+1)/100;             
            }    
            start = range.toperc+1;
            return range;
          });
          let arcanglestart = -90;    
          let arcangleend = -90;    
          if (config.fillarc.cutarc){
              arcanglestart = config.fillarc.angle[0];
          }
          if (config.fillarc.cutarc){
              arcangleend = config.fillarc.angle[1];
          }  
          config.arcanglestart = arcanglestart;
          config.arcangleend = arcangleend;       
          if (config.shapeCover.show){
              d3.select(params.chartholder).style("width",((config.chartWidth * 1.5) + 150)-config.shapeCover.reduceSize.width+"px");
              d3.select(params.chartholder).style("height",((config.chartWidth * 1.5)-config.shapeCover.reduceSize.height+"px"));          
          }else{  
              d3.select(params.chartholder).style("width",(config.chartWidth + 150-config.shapeCover.reduceSize.width)+"px");
              d3.select(params.chartholder).style("height",(config.chartWidth-config.shapeCover.reduceSize.height+"px"));
          }    
          d3.select(params.chartholder).style("padding-top",config.margin.top+"px");
          d3.select(params.chartholder).style("padding-right",config.margin.right+"px");            
          d3.select(params.chartholder).style("padding-bottom",config.margin.bottom+"px");   
          d3.select(params.chartholder).style("padding-left",config.margin.left+"px");        
          return config;
       }

       public percToDeg(perc:number) {
           return perc * 360;
       };

       public percToRad(perc:number) {
           return this.degToRad(this.percToDeg(perc));
       };

       public degToRad(deg:number) {
         return (deg * Math.PI) / 180;
       }

       public newAngle(d:number) {
         var ratio = this.scale(d);
         var newAngle = this.config.style.startAngle + ratio * this.config.angleRange;
         return newAngle;
       }
    
       public generateGauge(element:any,config:any) {
          this.config.elem = params.mainholder.querySelector("#gaugechartholder").querySelector("gauge-init").shadowRoot
          d3.select(this.config.elem).select("g").remove();
          let scrratio = 0;
          let top = 0;
          let left = -config.chartWidth/3;
          if (config.shapeCover.show){
              scrratio = 3.5;
              left = -config.chartWidth/1.2;
              top = -100;
          }else{
              scrratio = 1.5;
          }

          if (!config.gaugeRadius){
              let movey = config.moveY;
              if (config.label.length === 0){
                  movey = 0;
              }
              this.svg = d3.select(this.config.elem.querySelector("#guagechart"))
                  .attr('width', '100%')
                  .attr('height', '100%')
                  .attr(
                     'viewBox',
                      left + ' ' + top + ' ' + config.chartWidth * scrratio  + ' ' + config.chartWidth * scrratio 
                  )
                  .attr('preserveAspectRatio', 'xMinYMin')
                  .append("g")
                  .attr("transform","translate("+config.moveX+","+movey+")")
          }else{
              let movey = config.moveY;
              if (config.label.length === 0){
                  movey = 0;
              }
              this.svg = d3.select(this.config.elem.querySelector("#guagechart"))
                  .attr('width', '100%')
                  .attr('height', '100%')
                  .attr('preserveAspectRatio', 'xMinYMin')
                  .attr('viewBox',null)
                  .append("g")
                  .attr("transform","translate("+config.moveX+","+movey+")")          
          }        
          this.config.svg = this.svg;
          let transheight = config.radius; 
          if (config.shapeCover.show){
              if (config.shapeCover.shape === "circle"){
                  this.svg.append("g")
                      .attr('transform', 'translate(' + config.radius  + ',' + transheight + ')')
                      .append("circle")
                      .attr("r",config.radius+config.shapeCover.adjust.width)
                      .style("fill",config.shapeCover.fill)
                      .style("stroke",config.shapeCover.stroke)
              }        
              if (config.shapeCover.shape === "rect"){
                  this.svg.append("g")
                      .attr('transform', 'translate(' + "0" + ',' + "0" + ')')
                      .append("rect")
                      .attr("width",(config.radius * 2)+config.shapeCover.adjust.width)
                      .attr("height",(config.radius * 2)+config.shapeCover.adjust.height)
                      .style("fill",config.shapeCover.fill)
                      .style("stroke",config.shapeCover.stroke)
              }                   
          }
          this.g = this.svg.append("g").attr("transform","translate("+config.movechart.x+","+config.movechart.y+")");
          config.g = this.g;
          let positiony = 10;
          if (config.valueposition === "center"){
              positiony = transheight;
          }
          this.g.append("g").attr("id","label")
              .append("text")
              .attr("id","value")
              .style("font-size",(config.chartWidth/10)+"px")
              .style("fill",config.valueColor)
              .style("stroke",config.valueColor)
              .attr('transform', 'translate(' + config.radius + ',' + positiony + ')');
 
          this.g.append("g").attr("id","unitlabel")
              .append("text")
              .attr("id","unit")
              .style("font-size",(config.chartWidth/12)+"px")
              .style("fill",config.unitColor)
              .style("stroke",config.unitColor)
              .attr('transform', 'translate(' + config.radius + ',' + transheight + ')');


          this.arc = this.g
            .append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(' + config.radius + ',' + transheight + ')');
 
          this.garc = this.g
            .append('g')
            .attr('class', 'garc')
            .attr('transform', 'translate(' + config.radius + ',' + transheight + ')');


          this.marc = this.g
            .append('g')
            .attr('class', 'outerarc')
            .attr('transform', 'translate(' + config.radius + ',' + transheight + ')');

          this.scale = d3.scaleLinear()
               .range([0, 1])
               .domain([config.min, config.max]);

          this.ticks = this.scale.ticks(config.ticks.count);
          let diff = config.max-config.min;
          let pervalue = diff/config.ticks.count;   
          let start = 0;     
          let end = 0;  
          this.tickData = d3.range(config.ticks.count).map(() => {
              end = start;
              start += pervalue;
              return end;
          }); 
          if (this.tickData[this.tickData.length-1] < config.max){
              this.tickData.push(config.max);
          }   
          this.arcData = d3.range(config.ranges.length).map((range) => {
              return this.config.ranges[range].avalue;
          });    
          this.angles = []; 
          let iradius =  config.radius - config.ringWidth - config.ringInset ;
          let oradius = config.radius - config.ringInset;
          if (config.reducer && config.shapeCover){
              iradius = iradius - (iradius * .5);
              oradius = oradius - (oradius * .3);    
          }         
          if (config.outerLayerArc.show){
              iradius = config.radius - config.ringWidth - config.ringInset - config.outerLayerArc.width;
              oradius = config.radius - config.ringInset - config.outerLayerArc.width;
              this.runarcDraw = d3
                  .arc()
                  .innerRadius(config.radius - config.ringInset - config.outerLayerArc.width)
                  .outerRadius(config.radius - config.ringInset)
                  .startAngle((d:any, i:number) => {
                      var ratio = d * i;
                      return this.degToRad(config.arcanglestart + ratio * (config.angleRange+config.fillarc.angleadd));              
                   })
                  .cornerRadius(config.outerLayerArc.curvedArcRadius) 
                  .endAngle((d:any, i:any) => {
                       var ratio = d * (i+1);
                       return this.degToRad(config.arcanglestart + ratio * (config.angleRange+config.fillarc.angleadd));                 
                  });                
          }    
          this.arcDraw = d3
             .arc()
             .innerRadius(iradius)
             .outerRadius(oradius)
             .startAngle((d:any, i:number) => {
                  var ratio = d * i;
                  return this.degToRad(config.arcanglestart + ratio * (config.angleRange));              
              })
              .cornerRadius(config.fillarc.curvedarc.show?config.fillarc.curvedarc.radius:0) 
              .endAngle((d:any, i:any) => {
                   var ratio = d * (i+1); 
                  return this.degToRad(config.arcanglestart + ratio * (config.angleRange));                 
              });  
       
          this.arcCDraw = d3
             .arc()
             .innerRadius(iradius)
             .outerRadius(oradius)
             .startAngle((d:any, i) => {
                 let ratio:any = d.from;
                 return this.degToRad(config.arcanglestart + ratio * (config.angleRange+config.fillarc.angleadd));
              })
              .cornerRadius(config.fillarc.curvedarc.show?config.fillarc.curvedarc.radius:0)              
              .endAngle((d:any, i:any) => {
                 let ratio = d.to;
                 if (d.to === 1){
                     return this.degToRad(config.arcangleend + ratio *  config.angleRange);                    
                 }else{
                     return this.degToRad(config.arcanglestart + ratio *  (config.angleRange+config.fillarc.angleadd));
                 }    
              })
              

         this.tickArcs = this.arc
              .selectAll('path')
              .data(this.tickData)
              .enter()
              .append('path')
              .style('fill', (d:any, i:any) => {
                 return "transparent"
              })
               .attr('d', this.arcDraw);   

         this.movearc = this.marc       
              .selectAll('path')
              .data([1])
              .enter()
              .append('path')
              .style('fill', (d:any, i:any) => {
                 return this.config.outerLayerArc.fill;
              })
              .style('stroke', (d:any, i:any) => {
                 return this.config.outerLayerArc.stroke;
              })       
              .style('opacity', (d:any, i:any) => {
                 return this.config.outerLayerArc.opacity;
              })                      
               .attr('d', this.runarcDraw);    

         this.cummValue = 0;

         let narcData = [];
         let cumm = 0;
         this.arcData.forEach((value:number)=>{
              let a = {from:cumm,to:cumm+value};
              cumm += value;
              narcData.push(a);
         })
         let newarcData = narcData;
         let foundexceed = false;
         let startvalue = 1.1;
         let prev = 0
         narcData.map((adata)=>{
             if (adata.to != 1){
                 adata.from = prev;
                 adata.to = adata.to * startvalue;
                 prev = adata.to;
                 if (adata.to > 1){
                     foundexceed = true;
                 }
             }else{
                 adata.from = prev;   
                 if (adata.from > 1){
                     foundexceed = true;
                 }  
                 prev = adata.to;                          
             }
             startvalue -= .03
             return adata;
          });
          this.gaugeArcs = this.garc
              .selectAll('path')
              .data(narcData)
              .enter()
              .append('path')
              .style('fill',(d:any, i:any) => {
                 return this.config.ranges[i].color
              })
              .style('stroke',(d:any, i:any) => {
                 return this.config.ranges[i].stroke
              })  
              .style('opacity',(d:any, i:any) => {
                 return this.config.ranges[i].opacity
              })                          
              .attr('d', this.arcCDraw)
 
         this.farc = this.g
                        .append('g')
                        .attr('class', 'farc')
 

         if (this.config.needle){     
           this.drawNeedle();
         } 
         if (this.config.ticks.show || this.config.ticks.label.show ){
             this.updateLabels();   
         }    
         if (this.config.value){ 
             this.updateGaugeChart(this.config.value);
         }
       }

       public drawNeedle(){
         if (this.config.chartWidth < 1100){
             this.needle = this.g.append("g")
                 .attr("transform","translate(" + this.config.chartWidth/2 + "," + (this.config.chartWidth/2) + ")")
                 .attr('class', 'needle');
         }else{
             this.needle = this.g.append("g")
                 .attr("transform","translate(" + this.config.chartWidth/2 + "," + (this.config.chartWidth/2) + ")")
                 .attr('class', 'needle');
         }     
         let diff = this.config.max-this.config.min;
         let pervalue = diff/this.config.ticks.count;  
         let deg = 0;
         if (this.config.fillarc.angleadd){         
             deg = (this.config.fillarc.angleadd/2) + ((30/pervalue) * 7)
         }   
         let thetaRad = this.percToRad(30/diff) - this.degToRad(deg);
         let ng = this.needle.append("g");
         if (this.config.style.needletype === "normal"){        
             let TopX = this.centerX - (this.config.needleHeight) * Math.cos(thetaRad);
             let TopY = this.centerY - (this.config.needleHeight) * Math.sin(thetaRad);

             let LeftX = this.centerX + (this.config.needleRadius) * Math.cos(thetaRad - Math.PI / 2);
             let LeftY = this.centerY + (this.config.needleRadius) * Math.sin(thetaRad - Math.PI / 2);

             let RightX = this.centerX + (this.config.needleRadius) * Math.cos(thetaRad + Math.PI / 2);
             let RightY = this.centerY + (this.config.needleRadius) * Math.sin(thetaRad + Math.PI / 2);
             ng.append("path").attr('d', "M " + LeftX + ' ' + LeftY + ' L ' + TopX + ' ' + TopY + ' L ' + RightX + ' ' + RightY).style("fill",this.config.style.needleColor.fill).style("stroke",this.config.style.needleColor.stroke).style("stroke-width",this.config.style.needleColor.strokeWidth+"px");
         }
         if (this.config.style.needletype === "speedometer"){                 
             let  lineData = [ [this.config.needleRadius/2 , 0], 
                             [0, -this.config.needleHeight],
                             [-(this.config.needleRadius/2 ), 0],
	                           [0, 20],
                             [this.config.needleRadius/2, 0] ];         
	           let pg = ng.append('g').data([lineData]);
             let pointerLine = d3.line().curve(d3.curveLinear)
             let degs = thetaRad * (180 / Math.PI);
             degs -= this.config.fillarc.angleadd;
             if (this.config.fillarc.angleadjust){
                 degs -= (this.config.fillarc.angleadjust/4)+10;
             }              
             pg.append('path')
			         .attr('d', pointerLine)
			         .attr('transform', 'rotate(' + degs +')')
               .style("fill",this.config.style.needleColor.fill).style("stroke",this.config.style.needleColor.stroke).style("stroke-width",this.config.style.needleColor.strokeWidth+"px");
             this.needlepath = pg;              
         }
         this.needleg = ng;
         this.gcircle = this.needle.append("g");
         this.gcircle.append("circle").attr("r", this.config.needleRadius+2).attr("fill", this.config.style.needleCircleColor.fill).attr("stroke", this.config.style.needleCircleColor.stroke).attr("stroke-width", this.config.style.needleCircleColor.strokeWidth);
         if (this.config.style.needleInnerCircleStyle.show){
             this.gcircle.append("circle").attr("r", this.config.style.needleInnerCircleRadius+2).attr("fill", this.config.style.needleInnerCircleStyle.fill).attr("stroke", this.config.style.needleInnerCircleStyle.stroke).attr("stroke-width", this.config.style.needleInnerCircleStyle.strokeWidth+'px');
         }
          
         this.config.gcircle = this.gcircle;
       }

       public updateLabels(){
           if (this.config.ticks.show){
               this.ticklines = this.g
                   .append('g')
                   .attr('class', 'line')
                   .attr('transform', 'translate(' + this.config.radius + ',' + this.config.radius+ ')');

               let tickline = d3.line();
               let ticklinedata:any = [[5,0],[5,15]];

               this.ticklines.selectAll('line')   
                   .data(this.tickData)
                   .enter()
                   .append('path')   
                   .attr("d",tickline(ticklinedata))    
                   .attr('transform', (d:any,i:number) => {
                       let ratio = this.scale(d); 
                       let  newAngle = this.config.arcanglestart + ratio * (this.config.angleRange+this.config.fillarc.angleadd);
                       return (
                         'rotate(' +
                            newAngle +
                         ') translate(0,' +
                         (this.config.labelInset - this.config.radius - this.config.gaugeBandHeight) +
                        ')'
                      );
                  })  
                  .style("stroke",this.config.ticks.color)     
                  .style("stroke-opacity",this.config.ticks.opacity)  
           }         
           if (this.config.ticks.label.show){     
               this.labels = this.g
                   .append('g')
                   .attr('class', 'label')
                   .attr('transform', 'translate(' + this.config.radius + ',' + this.config.radius+ ')');
               this.endticks = [];
               this.config.ranges.forEach((range:any)=>{
                    this.endticks.push(range.to);
               });
               let prevvalue = 0;
               this.labels.selectAll('text')
                   .data(this.tickData)
                   .enter()
                   .append('text')
                   .attr('transform', (d:any,i:any) => {
                       let ratio = this.scale(d); 
                       let newAngle = this.config.arcanglestart + ratio * (this.config.angleRange+this.config.fillarc.angleadd);
                       let addposX = 0;
                       let addposY = 0;
                       if (newAngle <= 0){
                           addposY = 3;
                       }else{
                           addposY = 3;                   
                       }
                       if (d === 0 || String(d).length % 2 === 0){
                           if (newAngle <= 0){
                               addposX = 3;
                           }else{
                               addposY = 3;
                               addposX = -3;
                           }    
                       }
                       if (this.config.ticks.showendTicks){
                           if (newAngle <= 0){                        
                               addposX += -15; 
                           }else{    
                               addposY += -15;
                           }    
                           if (!this.config.gaugeRadius){
                              if (newAngle <= 0){                        
                                  addposX += -15; 
                              }else{    
                                  addposY += -15;
                              }                              
                           }  
                       }
                       if (!this.config.gaugeRadius){
                           if (newAngle <= 0){                        
                               addposY += 15; 
                           }else{    
                               addposX += 15;
                           }  
                           if (i === this.tickData.length-1){
                               if (newAngle <= 0){                        
                                   addposX += 25; 
                               }else{    
                                   addposY += 25;
                               }                            
                           }                          
                       }
                       let newpos = this.config.labelInset - this.config.radius + this.config.gaugeBandHeight;
                       if (this.config.ticks.label.movetoOuter){
                           newpos = this.config.labelInset - this.config.radius-this.config.gaugeBandHeight - this.config.outerRadius * .07 - this.config.ticks.label.movetoOuterPos;
                       }
                       return (
                         'rotate(' +
                            newAngle +
                         ') translate('+addposX+',' +
                         (newpos - addposY) +
                         ')'
                       );    
                   })
                   .text((d:any,i:number)=>{
                      if (this.config.ticks.showendTicks){
                          if (i === 0 || i === this.tickData.length -1 ){
                              return d;
                          }
                          let foundtick = false;
                          let findtick:number = 0;
                          this.endticks.forEach((tick:number)=>{
                             if (tick >= prevvalue && tick < d){
                                 foundtick = true;
                                 findtick = tick;
                             }
                          });
                          if (foundtick){
                              prevvalue = d;
                              return findtick;
                          }else{
                              prevvalue = d;
                              return '';
                          }   
                      }                    
                      if (this.config.ticks.type.toUpperCase() === "EVEN"){
                          if (i === 0 || i % 2 === 0){
                              return d;
                          }else{
                              return '';
                          }                
                      } 
                      if (this.config.ticks.type.toUpperCase() === "ODD"){
                          if (i === 1 || i % 3 === 0){
                              return d;
                          }else{
                              return '';
                          }                
                      }       
                      if (this.config.ticks.type.toUpperCase() === "NICE"){  
                          if (d === 0 || d % this.config.ticks.niceDivisor === 0){
                              return d;
                          }else{
                              return '';
                          }               
                      } 
                      return d;
                   })
                   .style("stroke",this.config.ticks.label.color)
                   .style("fill",this.config.ticks.label.color)               
                   .style("stroke-opacity",this.config.ticks.label.opacity)
                   .style("fill-opacity",this.config.ticks.label.opacity)
                   .style("font-size",!this.config.gaugeRadius?"1.5vw":".9vw")      
            }             
       }

       public updateGaugeChart(value:number) {   
          let diff = this.config.max-this.config.min;
          let pervalue = diff/this.config.ticks.count;  
          let tlvalue = 0;
          this.config.ranges.forEach((range:any)=>{
              if (!range.added){
                  tlvalue = range.to;
              }     
          });
          if (tlvalue === this.config.max){ 
              value += pervalue;
          }    
          let percent = (value/diff); 
          let self = this; 
          if (this.config.outerLayerArc.show){
              let i = 0;
              self.config.svg.transition().delay(0).ease(d3.easeLinear).duration(self.config.animationDuration).selectAll('.outerarc').tween('progress', function () {
                return function (percentOfPercent:number) {
                   let progress:number = (percentOfPercent * percent * 1.25);
                   let adata = [progress * .8];
                   if (i > 50){
                       let farc = self.farc 
                             .append('g')
                             .attr('class', 'farc')
                             .attr('transform', 'translate(' + self.config.radius + ',' + self.config.radius + ')');                    

                       farc
                         .selectAll('path')
                         .data(adata)
                         .enter()
                         .append('path')
                         .attr('fill',(d:any, i:any) => {
                              return self.config.fillarc.color
                          })
                         .attr('d', self.runarcDraw)
                    }
                    i+=1     
                }
              });   
          }
          if (self.config.style.labeldisplaytype === "percentage"){
              self.config.g.select("#value").text((percent * 100).toFixed(self.config.decimals) + ' ' + "%");
          }  
          if (self.config.style.labeldisplaytype === "value"){
              let cvalue = value - pervalue;
              let svalue = value.toFixed(self.config.decimals);
              if (this.config.commarequired){
                  svalue = this.format(svalue);
              }
              self.config.g.select("#value").text(svalue);
          }    
          self.config.g.select("#unit").text(self.config.unit);
          let bboxt =  self.config.g.select("#value").node().getBoundingClientRect();
          let bboxg = self.config.svg.node().getBBox();    //getBoundingClientRect();
          (this.config.elem.querySelector("#title") as HTMLElement).innerHTML = params.label;
          let res = (this.config.elem.querySelector("#title") as HTMLElement).offsetWidth;
          res = bboxg.x + ((bboxg.width-res)/2);
          if (this.config.shapeCover.show){
              (this.config.elem.querySelector("#title") as HTMLElement).style.left = (res+10) + "px";
          }else{
              (this.config.elem.querySelector("#title") as HTMLElement).style.left = res + "px";
          }
console.log(params);
          (this.config.elem.querySelector("#title") as HTMLElement).style.marginLeft = params.movetitle.x+"px";
          (this.config.elem.querySelector("#title") as HTMLElement).style.marginTop = params.movetitle.y+"px";
          let x = (-bboxt.width/2) + self.config.movevalueto.x;
          let height = bboxt.height;
          self.config.g.select("#label").attr("transform","translate("+x+","+self.config.movevalueto.y+")") 
          bboxt =  self.config.g.select("#unitlabel").node().getBoundingClientRect();
          x = (-bboxt.width/2)+self.config.movevalueto.x;
          self.config.g.select("#unitlabel").attr("transform","translate("+x+","+self.config.moveunitto.y+")") 
          let positiony = 10+height;
          if (self.config.valueposition === "center"){
              positiony = self.config.radius+height;
          }                            
          self.config.g.select("#unit").attr("transform","translate("+self.config.radius+","+positiony+")");

          self.config.svg.transition().delay(0).ease(d3.easeLinear).duration(self.config.animationDuration).selectAll('.needle').tween('progress', function () {
            return function (percentOfPercent:number) {
                let applycalc = 1.5;
                if (!self.config.gaugeRadius){
                    applycalc = 1.6;
                }
                let progress:number = (percentOfPercent * percent * applycalc);
                let deg = 0;
                if (self.config.fillarc.angleadd){      
                    deg = (self.config.fillarc.angleadd/2) 
                  }   
                let thetaRad:number = (self.percToRad(progress)/2) - self.degToRad(deg);   ;
                let degs = thetaRad * (180 / Math.PI);
                if (self.config.style.needletype === "normal"){
                    let TopX = self.centerX - (self.config.needleHeight) * Math.cos(thetaRad);
                    let TopY = self.centerY - (self.config.needleHeight) * Math.sin(thetaRad);

                    let LeftX = self.centerX - (self.config.needleRadius) * Math.cos(thetaRad - Math.PI / 2);
                    let LeftY = self.centerY - (self.config.needleRadius) * Math.sin(thetaRad - Math.PI / 2);

                    let RightX = self.centerX - (self.config.needleRadius) * Math.cos(thetaRad + Math.PI / 2);
                    let RightY = self.centerY - (self.config.needleRadius) * Math.sin(thetaRad + Math.PI / 2);
                    self.needle.select("path").attr('d', "M " + LeftX + ' ' + LeftY + ' L ' + TopX + ' ' + TopY + ' L ' + RightX + ' ' + RightY);
                }
                if (self.config.style.needletype === "speedometer"){
                    degs += (self.config.fillarc.angleadd/2);
                    if (self.config.fillarc.angleadjust){
                        degs -= self.config.fillarc.angleadjust;
                    } 
                    self.needlepath
			                  .attr('transform', 'rotate(' + degs +')')
                }                
                 
                if (self.config.fillarc.show){
                    let adata = [progress];
                    let farc = self.farc 
                             .append('g')
                             .attr('class', 'farc')
                             .attr('transform', 'translate(' + self.config.radius + ',' + self.config.radius + ')');                    

                    farc
                         .selectAll('path')
                         .data(adata)
                         .enter()
                         .append('path')
                         .attr('fill',(d:any, i:any) => {
                              return self.config.fillarc.color
                          })
                         .attr('d', self.arcDraw)                 
                }
             };
          });
       }       

       public updateChart(){
         try{
           if (Object.keys(this.config) > 0){
               this.config = this.setConfig("gaugechart",params);
               this.generateGauge("gaugechart",this.config); 
           }else{
                this.config = this.setConfig("gaugechart",params);
                this.generateGauge("gaugechart",this.config);    
           }   
         }catch(e){}   
       }

       public format(num:number) {
           return num.toString().replace(/^[+-]?\d+/, (int:any) => {
              return int.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
           });
       }

   };


   export function initchart(config:any){
      d3.select("svg").select("g").remove();
      gauge = new gaugeChart("gaugechart",config); 
   } 
   
   export function resizeChart(config:any){
      gauge.updateChart();    
   }  
      
   initchart(params);
  
</script>
<style>
  .title{
    color:white;
    font-size:19px;
    position:absolute;
  }
</style>

<template>
    <div class='title' id = 'title'><div></div></div>
    <svg style = "width:100%;height:100%"  id = "guagechart"></svg>
</template>