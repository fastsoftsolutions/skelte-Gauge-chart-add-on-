
export interface SvgWidgetHtmlAttributes {
    value: number; // live value
    decimals: number; // number of decimals to show on the value label
    min?: number;
    max?: number;
    unit?: string;
    label?: string; // additional label
    guageRadius?:number;
    guageBandHeight:number;
    moveX:number,
    moveY:number,
    commarequired:boolean;
    valueColor:string;
    unitColor:string;
    valueposition:string;
    unitposition:string;
    movevalueto:{
        x:number;
        y:number;
    },
    moveunitto:{
        x:number;
        y:number;
    }
    movechart:{
        x:number;
        y:number;
    }
    shapeCover:{
       fill:string;
       stroke:string;
       show:boolean;
       shape:string; // rect or circle
       reduceSize:{
          width:number;
          height:number;
       }
    },
    outerLayerArc:{
       show:boolean;
       fill:string;
       stroke:string;
       width:number;
       opacity:number;
       curvedArcRadius:number;
    },
    fillarc:{
       show:boolean; 
       color:string;
       cutarc:boolean;
       angle:any;
       angleadd:number;
       angleadjust:number;
       curvedarc:{
         show:boolean;
         radius:number;
       }
    },
    ticks: {
        count: number;
        color: string;
        opacity: number;
        width: number;
        length: number;
        show:boolean;
        niceDivisor:number;
        type:string; //Will be odd, even, all or nice
        ticksgap:number;
        showendTicks:boolean;
        label: {
            labelDecimals:number;
            color:string;
            opacity:number;
            show:boolean;
            movetoOuter:boolean;
            movetoOuterPos:number;
        }    
    }
    style: {
        lineWidth: number;
        lineBackColor: string;
        startAngle: number;
        endAngle: number;
        needle:boolean;
        needleColor:{
            fill:string;
            stroke:string;
            strokeWidth:number;
         },   
        needleCircleColor:{
           fill:string;
           stroke:string;
           strokeWidth:number;
        },   
        needleHeight:number;
        needleRadius:number;
        needletype:string;
        opacity:number;
        label:string;
        labeldisplaytype:string; // percentage or value
        needleInnerCircleStyle:{
            show:boolean;
            fill:string;
            stroke:string;
            strokeWidth:number;
        }
        needleInnerCircleRadius:number;
    }
    ranges?: {
        from: number;
        to: number;
        color: string;
        opacity?: number;
        label?: string;
    }[]; // gauges can have multiple ranges with different colors
    animationDuration?: number; // time in ms to animate the widget between the old and the new value and on initialisation from 0 to the new value
    reducer:boolean;
}
