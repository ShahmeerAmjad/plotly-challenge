
function makePlot(id){
    //get data from the json file
    d3.json("Data/samples.json").then((data)=>{
        console.log(data)

        var wfreq =data.metadata.map(d=>d.wfreq)
        console.log(`Washing Freq:${wfreq}`)

        //filter sample values by id
        var samples=data.samples.filter(s=>id.toString()===id)[0];

        console.log(samples);

        //sample top 10 values
        var samplevalues=samples.sample_values.slice(0,10).reverse();

        //get only top 10 otu ids 
        var top_otu=(samples.otu_ids.slice(0,10)).reverse();

        //map otu ids

        var otu_id=top_otu.map(d=>"OTU"+d)

        //get top 10 labels for plot

        var labels=samples.otu_labels.slice(0,10);


        //make trace variable for the plot

        var trace={
            x:samplevalues,
            y:otu_id,
            text: labels,
            marker:{
                color:'royalblue'
            },
            type:"bar",
            orientation:"h",
        };

        //create data variable
        var data=[trace];

        //create plot layour variable

        var layout={
            title:"Top 10 OTU ids",
            yaxis:{
                tickmode:"Linear",
            },
            margin:{
                l:100,
                r:100,
                t:100,
                b:100
            }
        };
        //plot bar plot
        Plotly.newPlot("bar",data,layout);


        //Build a bubble chart using sample data
        var trace1={
            x:samples.otu_ids,
            y:sample_values,
            type:"scatter",
            mode:"markers",
            marker:{
                size:samples.sample_values,
                color:samples.otu_ids
            },
            text:samples.otu_labels
        };

        //set layout for the bubble plot

        var layout_bub={
            xaxis:{title:"OTU ID Bubble Plot"},
            height:600,
            width:1000
        };

        //create variable from trace

        var bubbleChart=[trace1];
        //plot bubble chart
        Plotly.newPlot("bubble",bubbleChart,layout_bub);


        //create guage chart
        var data_gauge=[
            {
                domain:{x:[0,1],y:[0,1]},
                value:parseFloat(wfreq),
                title:{text:`Belly Button Washing Frequency`},
                type:"indicator",
                mode:"gauge+number",
                gauge:{axis:{range:[null,9] },
                steps:[
                    {range:[0,2],color:"red"},
                    {range:[2,4],color:"yellow"},
                    {range:[4,6],color:"teal"},
                    {range:[6,8],color:"lime"},
                    {range:[0,2],color:"red"},
                ]}
            }
        ];

        var layout_gauge={
            width:600,
            height:600,
            margin:{t:20, b:40,l:100,r:100}
        };
        Plotly.newPlot("gauge",data_gauge,layout_gauge)
    });
}

//Function to pull the necessary data

function getData(id){

    //get data from json file

    d3.json("Data/samples.json").then((data)=>{
        //get metadata for demographic vizualization

        var metadata=data.metadata;
        console.log(metadata)

        //create filter for data by id
        var result=metadata.filter(meta.id.toString()===id)[0];

        //select panel to display data

        var panelData=d3.select("#sample-metadata");

        //reset panel each time a new id is searched
        panelData.html("");

        //grab data for the id and append info to the data panel
        Object.entries(result).forEach((key)=>{
            panelData.append("h5").text(key[0].toUpperCase()+ ":"+ key[1]+ "\n");
        });
    });
}

//function to reset information when data is changed

function optionChanged(id){
    makePlot(id);
    getData(id);
}

function init(){
    //select dropdown manu
    var selector = d3.select("#selDataset");

    //use sample names to poulate select options

    d3.json("Data/samples.json").then((data) => {
        console.log(data)

        //push data to the dropdown menu
        data.names.forEach(function(name){
            dropdown.append("option").text(name).property("value");
        });

        //call functions to display data and visualziations on page
        makePlot(data.names[0]);
        getData(data.names[0]);
      });
    }
      //Initialize the website
      init();

