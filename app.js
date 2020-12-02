// use d3 to read the data on json file
d3.json("data/samples.json").then((importedData) => {
   console.log(importedData);
   
   // initialize with a data to be displayed
   function init() {
      
      //get the data of the first id
      var filterData = importedData.samples.filter(sample =>sample.id === '940');
      //console.log(filterData);
      
      var samplesData = filterData[0];
      //console.log(samplesData);

      //data for the bar chart
      var data = [{
         x: samplesData.sample_values.slice(0,10),
         y: samplesData.otu_ids.slice(0,10).map(d => "OTU " + d),
         type: "bar",
         orientation : "h",
         text: samplesData.otu_labels.slice(0,10),
      }];

      //set the layout
      var layout = {
         height: 600,
         width:400,
         xaxis:{
            //range: [0, 150],
            autorange: true,
            //dtick: 50
         },
         yaxis: {
            type: 'category',
            autorange: 'reversed'   
         }
      };

      //plot the bar chart
      Plotly.newPlot("bar", data, layout);

      //data for the bubble chart
      var dataOne = [{
         x:samplesData.otu_ids,
         y:samplesData.sample_values,
         mode: 'markers',
         marker:{
            size : samplesData.sample_values,
            color: samplesData.otu_ids
         },
         text: samplesData.otu_labels
      }]

      //set the layout
      var layoutOne = {
         height: 600,
         width: 1200,
         xaxis: {
            //range: [-400, 3700],
            autorange: true,
            //dtick: 500
         },
         yaxis:{
            autorange: true
         }
      }

      //plot the bubble chart
      Plotly.newPlot("bubble", dataOne, layoutOne)
   }

   //select the element to be add bio
   var PanelBody = d3.selectAll("#sample-metadata");
   var metadata = importedData.metadata[0];
   //console.log(metadata);

   //fill the info in the box(panel body)
   Object.entries(metadata).forEach(
      ([key,value]) => {
          var row = PanelBody.append("ul");
          var cell = row.append("il");
          cell.text(`${key} : ${value}`);
       }
   )

   //add option element to the select element
   var selectOption = d3.selectAll("#selDataset");
   importedData.names.forEach((name, index) => {
      //console.log(index,name);
      var el = selectOption.append("option");
      el.text(name);
      //console.log(el);
   })

   //on change to the DOM, call optionChanged
   selectOption.on("change", optionChanged);

   //function called by DOM changes
   function optionChanged() {

      //assign the value of the dropdown menu option to a variable
      var dropdownMenu = d3.select("#selDataset");
      var dataset = dropdownMenu.property("value");

      // console.log(dropdownMenu);
      // console.log(importedData);

      //filter the data by the value in the dropdown menu
      newSamplesData = importedData.samples.filter(sample =>sample.id === dataset);
      newMetadata = importedData.metadata.filter(meta => meta.id === parseInt(dataset));

      // console.log(newSamplesData);
      // console.log(newMetadata);
      
      //clear the output
      PanelBody.html("");
      
      //update the bio according to the value in the dropdown menu     
      newMetadata.forEach((bio) => {
         //var row = PanelBody.append("ul");
         Object.entries(bio).forEach(
            ([key,value]) => {
                 var row = PanelBody.append("ul");
                 var cell = row.append("il");
                cell.text(`${key} : ${value}`);
             }
         )
      })
      
      //restyle the bar and bubble charts 
      var updateSamples = newSamplesData[0]

      var barUpdate = {
         x: [updateSamples.sample_values.slice(0,10)],
         y: [updateSamples.otu_ids.slice(0,10).map(d => "OTU " + d)],
         text: [updateSamples.otu_labels.slice(0,10)]
      }

      //console.log(barUpdate)
      var bubbleUpdate ={
         x: [updateSamples.otu_ids],
         y: [updateSamples.sample_values],
         'marker.size' : [updateSamples.sample_values],
         'marker.color': [updateSamples.otu_ids],
         text: [updateSamples.otu_labels]
      }

      //update the charts acccording to the value in th dropdown menu
      Plotly.restyle("bar", barUpdate);
      Plotly.restyle("bubble", bubbleUpdate);
   }   
   
   
   init();
});