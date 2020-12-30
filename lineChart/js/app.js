var app = {}; // create namespace for our app [ We can also use  Immediately Invoked Function Expressions];

app.lineChartModel =  Backbone.Model.extend({
		defaults: {
				xaxis: '',
				records: '',	 
		}
}) 


app.lineChartCollection = Backbone.Collection.extend({
	model: app.lineChartModel,
	url:'data/lineChart.json',
}); // collection to fetch data from the URL

app.collection = new app.lineChartCollection();

// renders the line Chart View.
app.lineChartView = Backbone.View.extend({
	el: 'body',
	initialize: function () {		
		app.collection.fetch({success:(data)=>{ 
			this.lineChartData = data.toJSON();
		}}); // Loads data from  server			
	},
	events: {
		'change #graph-type': 'displayLineGraph'  // on change of select option  call display line graph function
	},

	displayLineGraph: function(e){
		this.graphProperty = e.target.value;

		this.filteredData = this.lineChartData[0].records.map((obj)=>{					
			return [new Date(obj.date),  obj[this.graphProperty]];
		})
		
		this.render();
	},

	render:function () {  // view renderer
		google.charts.load('current', {packages: ['corechart', 'line']});
		google.charts.setOnLoadCallback(this.drawVisualization.bind(this));

		return this;
	},

drawVisualization:function () {     // function to draw the line graph    
			var data = new google.visualization.DataTable();

			data.addColumn('date', 'Year');
			data.addColumn('number', this.graphProperty);
		
			data.addRows(this.filteredData);

			var options = {
				title: this.graphProperty,
				legend: { position: 'top', alignment: 'center' },
				hAxis: {					
					slantedText: true,
					slantedTextAngle: 45,
					textStyle: {
						fontSize: 10
					},
					format: 'dd-MM-yyyy'
				},					
			};
							
			var chart = new google.visualization.LineChart(this.$('#chart_div').get(0));
			chart.draw(data, options);
	}
	
});

    //--------------
    // Initializers
    //--------------   

app.appView = new app.lineChartView(); 






